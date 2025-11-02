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

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ✅ Ensure Axios sends cookies for cross-origin requests
  axios.defaults.withCredentials = true;

  // Fetch logged-in user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/auth/me`);
        setUser(res.data.user);
      } catch (err) {
        console.log("No user session found:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, [BACKEND_URL]);

  // Trigger Google OAuth login (redirect to backend)
  const handleGoogleSignIn = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Sign out (clears backend cookie)
  const handleSignOut = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/signout`);
      setUser(null);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <header className="header">
      <h2 className="logo">Euonroia</h2>

      <div className="header-actions">
        {user ? (
          <div className="user-info">
            {user.picture && (
              <img src={user.picture} alt={user.name} className="user-avatar" />
            )}
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
