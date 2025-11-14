import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import DashboardStats from "../components/DashboardStats";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/Dashboard.css";
import VerifyToken from "../components/auth/VerifyToken";

function DashboardContent() {
  const { user, loading } = useUser();
  const { theme } = useTheme();

  const [progressData, setProgressData] = useState({
    displayName: "",
    currentLesson: "",
    htmlBasicsProgress: 0,
    cssBasicsProgress: 0,
  });

  const [lessons, setLessons] = useState([
    { id: "html-basics", title: "HTML Basics", path: "html-basics", progress: 0 },
    { id: "css-intro", title: "CSS Basics", path: "css-intro", progress: 0 },
    { id: "js-start", title: "JavaScript for Beginners", path: "js-basics", progress: 0 },
  ]);

  // Fetch progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/progress`,
          { withCredentials: true }
        );
        const data = res.data;
        setProgressData(data);

        setLessons(prev =>
          prev.map(lesson => {
            if (lesson.id === "html-basics") return { ...lesson, progress: data.htmlBasicsProgress };
            if (lesson.id === "css-intro") return { ...lesson, progress: data.cssBasicsProgress };
            return lesson;
          })
        );
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };

    if (user) fetchProgress();
  }, [user]);

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

  const nextLesson =
    progressData.htmlBasicsProgress < 100
      ? lessons.find(l => l.id === "html-basics")
      : progressData.cssBasicsProgress < 100
      ? lessons.find(l => l.id === "css-intro")
      : lessons.find(l => l.id === "js-start");

  return (
    <div className={`dashboard-page ${theme}`}>
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-top">
          <div className="dashboard-left">
            <h1>Welcome back, {progressData.displayName || "Guest"}!</h1>
            <p>Ready to continue your coding journey?</p>

            <DashboardStats
              lessonsCompleted={lessons.filter(l => l.progress === 100).length}
              totalLessons={lessons.length}
              streak={3}
              xp={450}
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

        <div className="dashboard-bottom">
          <div className="dashboard-bottom-left">
            <h2>Achievements</h2>
            <p>Your unlocked badges and milestones will appear here.</p>
          </div>
          <div className="dashboard-bottom-right">
            <h2>Leaderboard</h2>
            <p>See how you rank compared to other students.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Dashboard() {
  return (
    <VerifyToken>
      <DashboardContent />
    </VerifyToken>
  );
}
