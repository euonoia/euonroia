// src/components/Header.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/components/header.css";

interface HeaderProps {
  hideUser?: boolean;          // hides nav links if true
  showLoginButton?: boolean;   // shows login button even if hideUser is true
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

      {/* Desktop nav links (hidden if hideUser is true) */}
      {!loading && user && !hideUser && (
        <nav className="nav-links desktop-only">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/lessons/html-basics">Lessons</Link>
          <Link to="/playground">Playground</Link>
        </nav>
      )}

      {/* Header buttons */}
      <div className="header-actions">
        {/* Show login button if user is not logged in OR forced by landing page */}
        {!loading && (!user || showLoginButton) && (
          <button className="btn" onClick={signInWithGoogle}>
            Continue with Google
          </button>
        )}

        {/* Theme toggle */}
        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* Hamburger menu for logged-in users */}
        {!loading && user && !hideUser && (
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        )}
      </div>

      {/* Dropdown menu for mobile */}
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
