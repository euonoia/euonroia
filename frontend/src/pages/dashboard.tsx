// --- imports (unchanged)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import DashboardStats from "../components/DashboardStats";
import VerifyToken from "../components/auth/VerifyToken";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import axios from "../utils/axiosClient";
import "../styles/pages/Dashboard.css";

// Types
interface Lesson {
  id: string;
  title: string;
  path: string;
  progress: number;
}

interface ProgressData {
  displayName: string;
  currentLesson: string;
  htmlBasicsProgress: number;
  cssBasicsProgress: number;
  javascriptProgress: number;
}

interface LeaderboardUser {
  rank: number;
  displayName: string;
  photoURL: string;
  xp: number;
  level: number;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
  earnedAt?: string;
}

const DashboardContent: React.FC = () => {
  const { user, loading } = useUser();
  const { theme } = useTheme();
  const [streak, setStreak] = useState<number>(0);
  const [lastActive, setLastActive] = useState<string>("");
  const [xp, setXP] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);



  const [progressData, setProgressData] = useState<ProgressData>({
    displayName: "",
    currentLesson: "",
    htmlBasicsProgress: 0,
    cssBasicsProgress: 0,
    javascriptProgress: 0,
  });

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: "html-basics", title: "HTML Basics", path: "html-basics", progress: 0 },
    { id: "css-intro", title: "CSS Basics", path: "css-intro", progress: 0 },
    { id: "javascript", title: "JavaScript for Beginners", path: "js-basics", progress: 0 },
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

useEffect(() => {
  if (!user) return;

  const fetchXP = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/milestones/xp`,
        { withCredentials: true }
      );
      setXP(res.data.xp);
      setLevel(res.data.level);
    } catch (err) {
      console.error("Failed to fetch user XP:", err);
    }
  };

  fetchXP();
}, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchStreak = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/milestones/streak`,
          { withCredentials: true }
        );

        setStreak(res.data.streak || 0);
        setLastActive(res.data.lastActive || "");
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    };

    fetchStreak();
  }, [user]);

  // Fetch user progress
  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get<ProgressData>(
          `${import.meta.env.VITE_BACKEND_URL}/api/milestones/progress`,
          { withCredentials: true }
        );

        const data = res.data;
        setProgressData(data);

        setLessons(prev =>
          prev.map(lesson => {
            if (lesson.id === "html-basics") return { ...lesson, progress: data.htmlBasicsProgress };
            if (lesson.id === "css-intro") return { ...lesson, progress: data.cssBasicsProgress };
            if (lesson.id === "javascript") return { ...lesson, progress: data.javascriptProgress };
            return lesson;
          })
        );
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };

    fetchProgress();
  }, [user]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get<{ leaderboard: LeaderboardUser[] }>(
          `${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`,
          { withCredentials: true }
        );

        const allUsers = res.data.leaderboard.map((u, index) => ({
          rank: index + 1,
          displayName: u.displayName || "Unknown",
          photoURL: u.photoURL || "/default-avatar.png",
          xp: u.xp ?? 0,
          level: u.level ?? 1,
        }));

        setLeaderboard(allUsers);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Fetch earned badges
  useEffect(() => {
    if (!user) return;

    const fetchBadges = async () => {
      try {
        const res = await axios.post<{ earnedBadges: Badge[] }>(
          `${import.meta.env.VITE_BACKEND_URL}/api/badgesEarned/earned`,
          { uid: user.id },
          { withCredentials: true }
        );
        setBadges(res.data.earnedBadges || []);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      } finally {
        setLoadingBadges(false);
      }
    };

    fetchBadges();
  }, [user]);

  // Loading screen
  if (loading) {
    return (
      <div className={`dashboard-page ${theme}`}>
        <Header />
        <main className="dashboard-main guest-main">
          <p>Loading your dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine next lesson
  const nextLesson =
    progressData.htmlBasicsProgress < 100
      ? lessons.find(l => l.id === "html-basics")
      : progressData.cssBasicsProgress < 100
      ? lessons.find(l => l.id === "css-intro")
      : progressData.javascriptProgress < 100
      ? lessons.find(l => l.id === "javascript")
      : undefined;

  return (
    <div className={`dashboard-page ${theme}`}>
      <Header />
      <main className="dashboard-main">
        {/* Top Section */}
        <div className="dashboard-top">
          <div className="dashboard-left">
            <h1>Welcome back, {progressData.displayName || "Guest"}!</h1>
            <p>Continue your coding journey today</p>

            {/* UPDATED: Dashboard Stats now uses real streak */}
            <DashboardStats
              lessonsCompleted={lessons.filter(l => l.progress === 100).length}
              streak={streak}
              xp={xp}
            />
          </div>

          <div className="dashboard-right">
            <h2>Continue Learning</h2>
            <div className="continue-learning-card">
              <p>
                <strong>Next Lesson:</strong> {nextLesson?.title || "All lessons completed!"}
              </p>
              {nextLesson && (
                <Link to={`/lessons/${nextLesson.path}`}>
                  <button className="start-lesson-btn">Start Lesson</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Lessons Overview */}
        <section className="lessons-overview">
          <h2>Your Lessons</h2>
          <div className="lessons-grid">
            {lessons.map(lesson => (
              <Link key={lesson.id} to={`/lessons/${lesson.path}`} className="lesson-link">
                <div className="lesson-card">
                  <h3>{lesson.title}</h3>
                  <progress value={lesson.progress} max={100} />
                  <span>{lesson.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <div className="dashboard-bottom">
          <div className="dashboard-bottom-left">
            <h2>Achievements</h2>
            <p>Track badges and milestones earned as you progress.</p>

            {loadingBadges ? (
              <p>Loading badges...</p>
            ) : badges.length === 0 ? (
              <p>No badges earned yet.</p>
            ) : (
              <div className="badges-grid">
                {badges.map(badge => (
                  <div key={badge.id} className="badge-card">
                    <span className="badge-icon">{badge.icon}</span>
                    <div>
                      <h4>{badge.title}</h4>
                      <p>{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-bottom-right">
            <h2>
              <FaTrophy className="inline-icon" /> Leaderboard
            </h2>
            <p>Check your rank and challenge yourself against peers.</p>

            {loadingLeaderboard ? (
              <p>Loading leaderboard...</p>
            ) : (
              <ol className="leaderboard-list">
                {leaderboard.map(user => (
                  <li
                    key={`${user.rank}-${user.displayName}`}
                    className={`leaderboard-item ${user.xp === 0 ? "zero-xp" : ""}`}
                  >
                    <span className="leaderboard-rank">{user.rank}.</span>
                    <span className="leaderboard-name">{user.displayName}</span>
                    <span className="leaderboard-xp">{user.xp} XP</span>
                    <span className="leaderboard-level">Lvl {user.level}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Dashboard: React.FC = () => (
  <VerifyToken>
    <DashboardContent />
  </VerifyToken>
);

export default Dashboard;
