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
        const res = await axios.get<{ user: { id: string; name: string; email: string; picture?: string } }>(
          `${BACKEND_URL}/auth/me`,
          { withCredentials: true }
        );

        if (res.data.user) navigate("/dashboard");
        else navigate("/");
      } catch (err) {
        console.error("OAuth callback fetch failed:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Logging you in...</p>;
  return null;
};

export default OAuthCallback;
