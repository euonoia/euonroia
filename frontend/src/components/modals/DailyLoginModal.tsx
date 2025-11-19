import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../styles/components/daily-login-modal.css";

interface Props {
  onClose: () => void;
}

interface StreakData {
  streak: number;
  xpEarned: number;
  lastActive: string; // ISO date string
  claimedToday: boolean;
  loggedDates: string[]; // ISO date strings of days logged in this month
}

export default function DailyLoginModal({ onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState<StreakData>({
    streak: 0,
    xpEarned: 0,
    lastActive: "",
    claimedToday: false,
    loggedDates: [],
  });
  const [claiming, setClaiming] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const claimedToday =
  new Date(streakData.lastActive).toDateString() === new Date().toDateString();

useEffect(() => {
  const fetchDailyLogin = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/daily-login-status`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();

      const lastLogin = new Date(data.lastLogin);
      const today = new Date();
      const claimedToday =
        lastLogin.getFullYear() === today.getFullYear() &&
        lastLogin.getMonth() === today.getMonth() &&
        lastLogin.getDate() === today.getDate();

      setStreakData({ ...data, claimedToday });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDailyLogin();
}, []);



  const handleClaimReward = async () => {
  if (claiming) return; // Prevent double-click
  setClaiming(true);

  try {
    // Call the backend to claim today's reward
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/milestones/daily-login`,
      {
        method: "POST",
        credentials: "include", // Send cookies/session
      }
    );

    if (!res.ok) throw new Error("Failed to claim reward");

    const data = await res.json();

    // Update modal state
    setStreakData(prev => ({
      ...prev,
      streak: data.streak,
      xpEarned: data.xpEarned,
      lastActive: data.lastActive,
      claimedToday: true,
      loggedDates: [...prev.loggedDates, new Date().toISOString().split("T")[0]], // update calendar
    }));

    // Show XP popup
    setShowXP(true);
    setTimeout(() => setShowXP(false), 1500);
  } catch (err) {
    console.error(err);
  } finally {
    setClaiming(false);
  }
};


 const generateMonthCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const formatLocalDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const todayStr = formatLocalDate(today);

  const dates: { day: number; date: string; logged: boolean; today: boolean }[] = [];

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    const localDate = formatLocalDate(date);
    const logged = streakData.loggedDates.includes(localDate);
    const isToday = localDate === todayStr;
    dates.push({ day: i, date: localDate, logged, today: isToday });
  }

  return dates;
};


  if (loading)
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
          <p>Loading your streak...</p>
        </div>
      </div>
    );

  const monthDates = generateMonthCalendar();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="modal-title">🎉 Daily Login Reward 🎉</h2>

        <div className="streak-info">
          <p>
            Streak: <strong>{streakData.streak}</strong> {streakData.streak === 1 ? "day" : "days"}
          </p>
          <p>
            XP Earned Today: <strong>{streakData.xpEarned}</strong>
          </p>
        </div>

        {/* Month Calendar */}
        <h3>{new Date().toLocaleString("default", { month: "long", year: "numeric" })}</h3>
        <div className="month-calendar">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="month-day-header">{d}</div>
          ))}
          {monthDates.map((day) => (
            <div
              key={day.date}
              className={`month-day ${day.logged ? "logged" : ""} ${day.today ? "today" : ""}`}
            >
              {day.day}
            </div>
          ))}
        </div>

        <div className="daily-reward-container">
            {/* Reward status message */}
            {streakData.claimedToday ? (
                <p className="claimed-text">Reward Claimed! 🎉</p>
            ) : null}

            {/* Claim reward button */}
            <button
                className={`btn claim-btn ${claiming ? "claiming" : ""}`}
                onClick={handleClaimReward}
                disabled={streakData.claimedToday || claiming}
            >
                {streakData.claimedToday
                ? "Already Claimed"
                : claiming
                ? "Claiming..."
                : "Claim Reward"}
            </button>

            {/* XP popup */}
            {showXP && <div className="xp-popup">+{streakData.xpEarned} XP!</div>}
            </div>

      </div>
    </div>
  );
}
