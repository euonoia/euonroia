import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // <-- import useNavigate
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { FiMenu, FiSun, FiMoon, FiHome, FiBook, FiCode, FiLogOut, FiAward } from "react-icons/fi"; // <-- FiAward for badge
import "../styles/components/header.css";

interface HeaderProps {
  hideUser?: boolean;
  showLoginButton?: boolean;
}

export default function Header({ hideUser = false, showLoginButton = false }: HeaderProps) {
  const { user, signOut, signInWithGoogle, loading } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // get current route
  const navigate = useNavigate(); // <-- added navigate

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleAddBadgeClick = () => {
    navigate("/add-badge"); // navigate to add-badge page
  };

  // Hide Sign Out if on a lesson page
  const isLessonPage = location.pathname.startsWith("/lessons/");

  return (
    <header className={`header ${theme}`}>
      <h2 className="logo">
        Euonroia <span className="beta-badge">BETA</span>
      </h2>

      <div className="header-actions">
        {!loading && (!user || showLoginButton) && (
          <button className="btn" onClick={signInWithGoogle}>
            Continue with Google
          </button>
        )}

        {/* Add Badge Button */}
        {!loading && user && (
          <button
            className="btn add-badge-btn"
            onClick={handleAddBadgeClick}
            style={{ marginRight: "0.5rem" }}
            title="Add Badge"
          >
            <FiAward /> Add Badge
          </button>
        )}

        {/* Theme toggle */}
        <button className="btn theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        {!loading && user && !hideUser && (
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle Menu">
            <FiMenu size={24} />
          </button>
        )}
      </div>

      {!loading && user && !hideUser && (
        <div className={`header-right ${menuOpen ? "open" : ""}`}>
          <div className="user-info">
            {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard">
              <FiHome style={{ marginRight: "0.25rem" }} /> Dashboard
            </Link>
            <Link to="/adding-feature">
              <FiBook style={{ marginRight: "0.25rem" }} /> Lessons
            </Link>
            <Link to="/adding-feature">
              <FiCode style={{ marginRight: "0.25rem" }} /> Playground
            </Link>
          </nav>

          {!isLessonPage && (
            <button className="btn signout-btn" onClick={signOut} style={{ marginTop: "1rem" }}>
              <FiLogOut style={{ marginRight: "0.25rem" }} /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
