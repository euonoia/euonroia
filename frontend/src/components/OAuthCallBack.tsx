import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosClient";
import Cookies from "js-cookie";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing sign in...");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://euonroia.onrender.com";

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      try {
        setMessage("Checking authentication...");

        // ✅ Attach CSRF token from cookie if backend expects it
        const csrfToken = Cookies.get("csrfToken");

        const res = await axios.post(
          `${BACKEND_URL}/auth/me`,
          {},
          {
            headers: { "x-csrf-token": csrfToken || "" },
            withCredentials: true, // include HTTP-only cookies
            timeout: 5000,
          }
        );

        if (!mounted) return;

        if (res.data?.user) {
          setMessage("Login successful — redirecting...");
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
  }, [navigate, BACKEND_URL]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
      <p>
        If you are not redirected automatically, try refreshing or logging in again.
      </p>
    </div>
  );
};

export default OAuthCallback;
