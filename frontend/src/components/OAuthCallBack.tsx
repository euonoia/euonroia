import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");

  // ✅ Your backend endpoint (Render backend)
  const BACKEND_URL = "https://euonroia-secured.onrender.com";

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      try {
        setMessage("Checking authentication...");

        // ✅ Directly call your backend (include cookies!)
        const res = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true, // very important for HTTP-only cookies
          timeout: 5000,
        });

        if (!mounted) return;

        if (res.data?.user) {
          setMessage("Login successful — redirecting...");
          // short delay for smooth UX
          setTimeout(() => navigate("/dashboard"), 800);
        } else {
          setMessage("Login failed — redirecting to home...");
          setTimeout(() => navigate("/"), 1200);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        if (!mounted) return;
        setMessage("Login failed — redirecting to home...");
        setTimeout(() => navigate("/"), 1200);
      }
    };

    checkLogin();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
      <p>
        If you are not redirected automatically, try refreshing or logging in
        again.
      </p>
    </div>
  );
};

export default OAuthCallback;
