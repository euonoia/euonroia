// frontend/src/components/Header.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import "../styles/components/header.css";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme } = useTheme();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // -----------------------------
  // Helper: get JWT from localStorage
  // -----------------------------
  const getToken = () => localStorage.getItem("authToken");

  // -----------------------------
  // Fetch current user from backend
  // -----------------------------
  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("No user session found:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) fetchUser(token);
  }, [BACKEND_URL]);

  // -----------------------------
  // Handle OAuth redirect (JWT in URL)
  // -----------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // Save JWT to localStorage
      localStorage.setItem("authToken", token);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch user with the new token
      fetchUser(token);
    }
  }, [BACKEND_URL]);

  // -----------------------------
  // Google Sign-In
  // -----------------------------
  const handleGoogleSignIn = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // -----------------------------
  // Sign out
  // -----------------------------
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <header className="header">
      <h2 className="logo">Euonroia</h2>

      <div className="header-actions">
        {user ? (
          <div className="user-info">
            {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
            <button className="btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="btn" onClick={handleGoogleSignIn}>
            Continue with Google
          </button>
        )}

        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </header>
  );
}
