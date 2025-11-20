import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { FiMenu, FiSun, FiMoon, FiCalendar } from "react-icons/fi";
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

  // Select the correct logo based on theme
  const logoSrc = theme === "light" ? "/Euonroia_Light.png" : "/Euonroia_Dark.png";

  return (
    <header className={`header ${theme}`}>
      {/* Logo */}
      <Link to="/" className="logo-link">
        <div className="logo-container">
          <img src={logoSrc} alt="Euonroia Logo" className="logo-img" />
          <span className="beta-badge">BETA</span>
        </div>
      </Link>

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

      {/* Expanded menu for logged-in users */}
      {!loading && user && menuOpen && (
        <div className="header-right open">
          <div className="user-info">
            {user.picture && <img src={user.picture} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/lessons">Lessons</Link>
            <Link to="/playground">Playground</Link>
          </nav>

          {!isLessonPage && (
            <button className="btn signout-btn" onClick={signOut}>
              Sign Out
            </button>
          )}
        </div>
      )}

      {/* Daily Login Modal */}
      {dailyLoginOpen && (
        <DailyLoginModal onClose={() => setDailyLoginOpen(false)} />
      )}
    </header>
  );
}
