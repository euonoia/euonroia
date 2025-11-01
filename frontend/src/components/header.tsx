import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/components/header.css"; // ✅ We'll move visual styling here

interface User {
  name: string;
  email: string;
  picture?: string;
  uid: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage
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
    } catch (err) {
      console.error("Token verification failed:", err);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const handleGoogleSignIn = () => {
    const authUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
    const popup = window.open(authUrl, "GoogleAuth", "width=500,height=600");

    if (!popup) {
      console.error("Popup blocked");
      return;
    }

    const pollTimer = setInterval(() => {
      try {
        if (popup.closed) clearInterval(pollTimer);

        const idToken = localStorage.getItem("idToken");
        if (idToken) {
          clearInterval(pollTimer);
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

      {user ? (
        <div className="user-info">
          {user.picture && (
            <img src={user.picture} alt={user.name} className="user-avatar" />
          )}
          <span className="user-name">{user.name}</span>
          <button onClick={handleSignOut} className="btn">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn} className="btn btn-google">
          Sign in with Google
        </button>
      )}
    </header>
  );
}
