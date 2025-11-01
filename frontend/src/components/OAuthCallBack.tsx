import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, { idToken: token });
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(user));

        if (window.opener) {
          window.opener.postMessage({ user }, window.location.origin);
          window.close();
        } else {
          navigate("/dashboard");
        }
      } catch {
        console.error("Token verification failed");
      }
    };

    verifyToken();
  }, []);

  return <div>Logging in...</div>;
}
