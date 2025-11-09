import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://euonroia-secured.onrender.com";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      try {
        setMessage("Checking authentication...");

        const res = await axios.get(`${BACKEND_URL}/auth/me`, {
          withCredentials: true, // ensures cookie is sent
          timeout: 5000,
        });

        if (!mounted) return;

        if (res.data?.user) {
          setMessage("Login successful — redirecting...");
          navigate("/dashboard");
        } else {
          setMessage("Login failed — redirecting to home...");
          setTimeout(() => navigate("/"), 800);
        }
      } catch (err) {
        console.error("OAuthCallback error:", err);
        if (!mounted) return;
        setMessage("Login failed — redirecting to home...");
        setTimeout(() => navigate("/"), 800);
      }
    };

    checkLogin();

    return () => { mounted = false; };
  }, [navigate]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>{message}</h2>
      <p>If you are not redirected automatically, try refreshing or logging in again.</p>
    </div>
  );
};

export default OAuthCallback;
