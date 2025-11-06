import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/components/header.css";

export default function Header() {
  const { user, signOut, signInWithGoogle } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className={`header ${theme}`}>
      <h2 className="logo">Euonroia</h2>

      {/* Nav links for desktop */}
      {user && (
        <nav className="nav-links desktop-only">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/lessons">Lessons</Link>
          <Link to="/playground">Playground</Link>
        </nav>
      )}

      {/* Buttons for guests or logged-in users */}
      <div className="header-actions">
        {!user && (
          <>
            <button className="btn" onClick={signInWithGoogle}>
              Continue with Google
            </button>
            <button className="btn theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </>
        )}

        {/* Hamburger: only visible if user is logged in */}
        {user && (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        )}
      </div>

      {/* Dropdown for user info */}
      {user && (
        <div className={`header-right ${menuOpen ? "open" : ""}`}>
          <div className="user-info">
            {user.picture && (
              <img src={user.picture} alt={user.name} className="user-avatar" />
            )}
            <span className="user-name">{user.name}</span>
            <button className="btn" onClick={signOut}>Sign Out</button>
            <button className="btn theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>

          {/* Mobile-only nav-links */}
          <nav className="nav-links mobile-only">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/lessons">Lessons</Link>
            <Link to="/playground">Playground</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
