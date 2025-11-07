import { Link, Navigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import DashboardStats from "../components/DashboardStats";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/pages/Dashboard.css";

export default function Dashboard() {
  const { user, loading } = useUser(); // Get user + loading state
  const { theme } = useTheme();

  // Show a loading state while fetching the user
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

  // Redirect to the landing page only if user is confirmed as null
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Example lessons data
  const lessons = [
    { id: "html-basics", title: "HTML Basics", progress: 100 },
    { id: "css-intro", title: "Intro to CSS", progress: 60 },
    { id: "js-start", title: "JavaScript for Beginners", progress: 0 },
  ];

  return (
    <div className={`dashboard-page ${theme}`}>
      <Header />

      <main className="dashboard-main">
        {/* Top Section */}
        <div className="dashboard-top">
          <div className="dashboard-left">
            <h1>Welcome back, {user.name}!</h1>
            <p>Ready to continue your coding journey?</p>

            <DashboardStats
              lessonsCompleted={2}
              totalLessons={10}
              streak={3}
              xp={450}
            />
          </div>

          <div className="dashboard-right">
            <h2>Continue Learning</h2>
            <div className="continue-learning-card">
              <p>
                <strong>Next Lesson:</strong> Build Your First HTML Page
              </p>
              <Link to="/lessons/html-basics">
                <button className="start-lesson-btn">Start Lesson</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Lessons Overview Section */}
        <section className="lessons-overview">
          <h2>Your Lessons</h2>
          <div className="lessons-grid">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="lesson-link"
              >
                <div className="lesson-card">
                  <h3>{lesson.title}</h3>
                  <progress value={lesson.progress} max={100} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom Section (Achievements & Leaderboard) */}
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

    </div>
  );
}
