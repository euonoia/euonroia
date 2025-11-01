import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import "../styles/components/header.css";

interface User {
  name: string;
  email: string;
  picture?: string;
  uid: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Verify Firebase ID token with backend
  const verifyToken = async (idToken: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, { idToken });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // Google sign-in popup flow
  const handleGoogleSignIn = () => {
    const popup = window.open(
      `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
      "GoogleAuth",
      "width=500,height=600"
    );

    if (!popup) return;

    // Listen for postMessage from popup
    const listener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { user } = event.data;
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        window.removeEventListener("message", listener);
      }
    };

    window.addEventListener("message", listener);
  };

  // Sign out user
  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
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
