import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { FiMenu, FiSun, FiMoon, FiCalendar, FiHome, FiBook, FiCode, FiLogOut } from "react-icons/fi";
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

      {/* Header Actions */}
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
              <FiCalendar />
              Daily Login
            </button>

            <button className="btn theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </button>

            {/* Hamburger + Dropdown */}
            <div className="hamburger-container">
              <button className="hamburger" onClick={toggleMenu}>
                <FiMenu size={24} />
              </button>

              <div className={`header-dropdown ${menuOpen ? "open" : ""}`}>
                <div className="dropdown-drip"></div>
                <nav className="nav-links">
                  <Link to="/dashboard"><FiHome /> Dashboard</Link>
                  <Link to="/lessons"><FiBook /> Lessons</Link>
                  <Link to="/playground"><FiCode /> Playground</Link>
                  {!isLessonPage && (
                    <button className="signout-btn"><FiLogOut /> Sign Out</button>
                  )}
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Daily Login Modal */}
      {dailyLoginOpen && <DailyLoginModal onClose={() => setDailyLoginOpen(false)} />}
    </header>
  );
}
