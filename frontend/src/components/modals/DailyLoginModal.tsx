import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFire, FaRegStar } from "react-icons/fa";
import "../../styles/components/daily-login-modal.css";

interface StreakResponse {
  streak: number;
  lastLogin: string;
  lastClaimedReward: string;
  loggedDates: string[];
}

interface ClaimResponse {
  streak: number;
  xpEarned: number;
  claimedToday: boolean;
  lastActive: string;
}

export default function DailyLoginModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [loggedDates, setLoggedDates] = useState<string[]>([]);

  const getCookie = (name: string) =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || "";

  const authToken = getCookie("euonroiaAuthToken");
  const csrfToken = getCookie("euonroiaCsrfToken");

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/milestones/daily-login`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "x-csrf-token": csrfToken,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch streak");

        const data: StreakResponse = await res.json();
        setStreak(data.streak);
        setLoggedDates(data.loggedDates || []);
        const todayStr = new Date().toISOString().slice(0, 10);
        setClaimedToday(data.lastClaimedReward.slice(0, 10) === todayStr);
      } catch (err) {
        console.error("Daily streak fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, []);

  const claimReward = async () => {
    if (claiming || claimedToday) return;
    setClaiming(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/milestones/daily-login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "x-csrf-token": csrfToken,
          },
        }
      );

      const data: ClaimResponse = await res.json();
      setStreak(data.streak);
      setXpEarned(data.xpEarned);
      setClaimedToday(true);

      const todayStr = new Date().toISOString().slice(0, 10);
      setLoggedDates((prev) => [...prev, todayStr]);

      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
    } catch (err) {
      console.error("Claim reward error:", err);
    } finally {
      setClaiming(false);
    }
  };

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const todayStr = today.toISOString().slice(0, 10);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const dates = [];

    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      dates.push({
        day: d,
        date: dateStr,
        logged: loggedDates.includes(dateStr),
        today: dateStr === todayStr,
      });
    }
    return dates;
  };

  const monthDates = generateCalendar();

  if (loading)
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading daily reward...</p>
        </div>
      </div>
    );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="modal-title">
          <FaFire className="icon" /> Daily Login Reward <FaRegStar className="icon" />
        </h2>

        <p className="streak-info">
          Streak: <strong>{streak}</strong> days
        </p>

        <h3 className="calendar-title">
          {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>

        <div className="month-calendar">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="month-day-header">{d}</div>
          ))}
          {monthDates.map((d) => (
            <div
              key={d.date}
              className={`month-day ${d.logged ? "logged" : ""} ${d.today ? "today" : ""}`}
            >
              {d.day}
            </div>
          ))}
        </div>

        <button
          className={`claim-btn ${claiming ? "claiming" : ""}`}
          disabled={claimedToday || claiming}
          onClick={claimReward}
        >
          {claimedToday ? "Reward Claimed" : claiming ? "Claiming..." : "Claim Reward"}
        </button>

        {showXP && <div className="xp-popup">+{xpEarned} XP!</div>}
      </div>
    </div>
  );
}
