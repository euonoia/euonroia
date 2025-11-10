// src/components/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import LoginWarning from "../components/messages/LoginWarning"; // ✅ import the new component
import "../styles/components/header.css";

interface HeaderProps {
  hideUser?: boolean;
  showLoginButton?: boolean;
}

export default function Header({
  hideUser = false,
  showLoginButton = false,
}: HeaderProps) {
  const { user, signOut, signInWithGoogle, loading } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={`header ${theme}`}>
      <h2 className="logo">Euonroia</h2>

      {/* Show login warning if cookies are blocked */}
      <LoginWarning />

      {/* Desktop nav links */}
      {!loading && user && !hideUser && (
        <nav className="nav-links desktop-only">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/lessons/html-basics">Lessons</Link>
          <Link to="/playground">Playground</Link>
        </nav>
      )}

      {/* Header buttons */}
      <div className="header-actions">
        {!loading && (!user || showLoginButton) && (
          <button className="btn" onClick={signInWithGoogle}>
            Continue with Google
          </button>
        )}

        {/* Theme toggle */}
        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {!loading && user && !hideUser && (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {!loading && user && !hideUser && (
        <div className={`header-right ${menuOpen ? "open" : ""}`}>
          <div className="user-info">
            {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
            <button className="btn" onClick={signOut}>Sign Out</button>
          </div>

          <nav className="nav-links mobile-only">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/lessons/html-basics">Lessons</Link>
            <Link to="/playground">Playground</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
