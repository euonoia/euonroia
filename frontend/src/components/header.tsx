import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/components/header.css";

interface User {
  name: string;
  email: string;
  picture?: string;
  uid: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const verifyToken = async (idToken: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`,
        { idToken }
      );
      const userData: User = res.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const handleGoogleSignIn = () => {
    const popup = window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
      "GoogleAuth",
      "width=500,height=600"
    );
    if (!popup) return;

    const timer = setInterval(() => {
      try {
        if (popup.closed) clearInterval(timer);
        const idToken = localStorage.getItem("idToken");
        if (idToken) {
          clearInterval(timer);
          verifyToken(idToken);
          popup.close();
          localStorage.removeItem("idToken");
        }
      } catch {}
    }, 500);
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
            <button className="btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <button className="btn" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
}
