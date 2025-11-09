import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://euonroia-secured.onrender.com";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Request current user; cookie is sent automatically
        const res = await axios.get<{ user: { id: string; name: string; email: string; picture?: string } }>(
          `${BACKEND_URL}/auth/me`,
          { withCredentials: true }
        );

        if (res.data.user) {
          navigate("/dashboard"); // user exists → go to dashboard
        } else {
          navigate("/"); // fallback
        }
      } catch (err) {
        console.error("OAuth callback fetch failed:", err);
        navigate("/"); // fallback
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Logging you in, please wait...</p>;
  return null;
};

export default OAuthCallback;
