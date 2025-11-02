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

  // ✅ Automatically choose backend based on environment
  const BACKEND_URL =
    import.meta.env.MODE === "production"
      ? "https://euonroia-backend.onrender.com"
      : "http://localhost:5000";

  // ✅ Set axios defaults globally for consistency
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = BACKEND_URL;

  // ✅ Fetch current logged-in user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me");
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("No user session found:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // 🟢 Trigger Google OAuth (redirects to backend)
  const handleGoogleSignIn = () => {
    // backend handles redirect to Google, sets cookie, then returns here
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // 🔴 Sign out (clear cookie on backend)
  const handleSignOut = async () => {
    try {
      await axios.post("/auth/signout");
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
