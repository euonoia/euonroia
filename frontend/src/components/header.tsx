// frontend/src/components/Header.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import "../styles/components/header.css";

interface User {
  uid: string;
  name: string;
  email: string;
  picture?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme } = useTheme();

  // ✅ Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          { withCredentials: true } // must include cookies
        );
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Full-page redirect to backend Google OAuth
  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  // Sign out via backend
  const handleSignOut = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return (
    <header className="header">
      <h2 className="logo">Euonroia</h2>

      <div className="header-actions">
        {user ? (
          <div className="user-info">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="user-avatar"
              />
            )}
            <span className="user-name">{user.name}</span>
            <button className="btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="btn" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        )}

        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </header>
  );
}
