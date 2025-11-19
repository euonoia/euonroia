import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiHome,
  FiBook,
  FiCode,
  FiLogOut,
  FiCalendar,
} from "react-icons/fi";
import DailyLoginModal from "./modals/DailyLoginModal";
import "../styles/components/header.css";

export default function Header() {
  const { user, signOut, signInWithGoogle, loading } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dailyLoginOpen, setDailyLoginOpen] = useState(false);

  const location = useLocation();
  const isLessonPage = location.pathname.startsWith("/lessons/");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={`header ${theme}`}>
      <h2 className="logo">
        Euonroia <span className="beta-badge">BETA</span>
      </h2>

      <div className="header-actions">
        {!loading && !user && (
          <>
            <button className="btn" onClick={signInWithGoogle}>
              Continue with Google
            </button>

            <button className="btn theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>
          </>
        )}

        {!loading && user && (
          <>
            <button
              className="btn daily-login-btn"
              onClick={() => setDailyLoginOpen(true)}
            >
              <FiCalendar style={{ marginRight: "0.25rem" }} />
              Daily Login
            </button>

            <button className="btn theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>

            <button className="hamburger" onClick={toggleMenu}>
              <FiMenu size={24} />
            </button>
          </>
        )}
      </div>

      {!loading && user && (
        <div className={`header-right ${menuOpen ? "open" : ""}`}>
          <div className="user-info">
            {user.picture && <img src={user.picture} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard"><FiHome /> Dashboard</Link>
            <Link to="/lessons"><FiBook /> Lessons</Link>
            <Link to="/playground"><FiCode /> Playground</Link>
          </nav>

          {!isLessonPage && (
            <button className="btn signout-btn" onClick={signOut}>
              <FiLogOut /> Sign Out
            </button>
          )}
        </div>
      )}

      {/* Daily Login Modal */}
      {dailyLoginOpen && (
        <DailyLoginModal
          onClose={() => setDailyLoginOpen(false)}
        />
      )}
    </header>
  );
}
