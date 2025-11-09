import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://euonroia-secured.onrender.com";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for backend to set cookie and verify user
        const res = await axios.get(`${BACKEND_URL}/auth/me`, { withCredentials: true });
        if (res.data.user) {
          navigate("/dashboard"); // user exists, go to dashboard
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
  }, [navigate, BACKEND_URL]);

  if (loading) return <p>Logging you in, please wait...</p>;
  return null;
}
