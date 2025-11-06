import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import DashboardStats from '../components/DashboardStats';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext'; // add this
import '../styles/pages/Dashboard.css';

export default function Dashboard() {
  const { user } = useUser();
  const { theme } = useTheme(); // get current theme

  const lessons = [
    { id: 'html-basics', title: 'HTML Basics', progress: 100 },
    { id: 'css-intro', title: 'Intro to CSS', progress: 60 },
    { id: 'js-start', title: 'JavaScript for Beginners', progress: 0 },
  ];

  if (!user) {
    return (
      <div className={`dashboard-page ${theme}`}>
        <Header />
        <main className="dashboard-main guest-main">
          <h1>Welcome to Euonroia 🚀</h1>
          <p>Please sign in to access your personalized dashboard.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`dashboard-page ${theme}`}>
      <Header />

      <main className="dashboard-main">
        {/* Top two-column section */}
        <div className="dashboard-top">
          {/* Left column: greeting + stats */}
          <div className="dashboard-left">
            <h1>Welcome back, {user.name} 👋</h1>
            <p>Ready to continue your coding journey?</p>

            <DashboardStats
              lessonsCompleted={2}
              totalLessons={10}
              streak={3}
              xp={450}
            />
          </div>

          {/* Right column: Continue Learning */}
          <div className="dashboard-right">
            <h2>Continue Learning</h2>
            <div className="continue-learning-card">
              <p><strong>Next Lesson:</strong> Build Your First HTML Page</p>
              <Link to="/lesson/html-basics">
                <button>Start Lesson</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Lessons Overview */}
        <section className="lessons-overview">
          <h2>Your Lessons</h2>
          <div className="lessons-grid">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lesson/${lesson.id}`}
                className="lesson-link"
              >
                <div className="lesson-card">
                  <h3>{lesson.title}</h3>
                  <progress value={lesson.progress} max="100" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom Section: Achievements + Leaderboard */}
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
