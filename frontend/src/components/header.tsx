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

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        withCredentials: true, // important for HTTP-only cookies
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();

    // Optional: detect if redirected from Google OAuth and refetch
    if (window.location.search.includes("code=")) {
      fetchUser();
      // Clean up URL
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  const handleSignOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signout`, {}, { withCredentials: true });
      setUser(null);
    } catch {
      console.error("Failed to sign out");
    }
  };

  return (
    <header className="header">
      <h2 className="logo">Euonroia</h2>

      <div className="header-right">
        {user ? (
          <div className="user-info">
            {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
            <span className="user-name">{user.name}</span>
            <button className="btn" onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button className="btn" onClick={handleGoogleSignIn}>Sign in with Google</button>
        )}

        <button className="btn theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </header>
  );
}
