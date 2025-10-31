import { useState, useEffect } from "react";
import axios from "axios";

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
    <header
      style={{
        backgroundColor: "#282c34",
        padding: "1rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Euonroia</h2>
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              style={{ width: "35px", borderRadius: "50%" }}
            />
          )}
          <span>{user.name}</span>
          <button onClick={handleSignOut} style={buttonStyle}>
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn} style={buttonStyle}>
          Sign in with Google
        </button>
      )}
    </header>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4285F4",
  color: "white",
  border: "none",
  borderRadius: "0.3rem",
  cursor: "pointer",
  fontWeight: "bold",
};
