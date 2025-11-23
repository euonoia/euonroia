import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { FiMenu, FiSun, FiMoon, FiCalendar, FiHome, FiBook, FiCode, FiLogOut } from "react-icons/fi";
import DailyLoginModal from "./modals/DailyLoginModal";
import PolicyConsentModal from "../pages/policy/PolicyConsentModal"; 
import "../styles/components/header.css";

export default function Header(): React.ReactNode {
  const { user, signOut, signInWithGoogle, loading, fetchUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dailyLoginOpen, setDailyLoginOpen] = useState<boolean>(false);
  const [policyModalOpen, setPolicyModalOpen] = useState<boolean>(false);

  const location = useLocation();
  const isLessonPage = location.pathname.startsWith("/lessons/");

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const logoSrc: string = theme === "light" ? "/Euonroia_Light.png" : "/Euonroia_Dark.png";

  // Open policy modal automatically if user hasn't agreed
  useEffect(() => {
    if (user && user.agreedToPolicies !== true) {
      setPolicyModalOpen(true);
    }
  }, [user]);

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
                  <Link to="/dashboard">
                    <FiHome /> Dashboard
                  </Link>
                  <Link to="/lessons">
                    <FiBook /> Lessons
                  </Link>
                  <Link to="/playground">
                    <FiCode /> Playground
                  </Link>

                  <div className="signout-divider"></div>

                  <button className="signout-btn" onClick={signOut}>
                    <FiLogOut /> Sign Out
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Daily Login Modal */}
      {dailyLoginOpen && <DailyLoginModal onClose={() => setDailyLoginOpen(false)} />}

      {/* Policy Consent Modal */}
      {policyModalOpen && user && (
        <PolicyConsentModal
          onClose={() => setPolicyModalOpen(false)}
        />
      )}
    </header>
  );
}
