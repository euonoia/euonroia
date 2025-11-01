import { useState, useEffect } from "react";
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleGoogleSignIn = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const popup = window.open(
      `${backendUrl}/auth/google`, // uses /auth/google
      "GoogleAuth",
      "width=500,height=600"
    );
    if (!popup) return;

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
