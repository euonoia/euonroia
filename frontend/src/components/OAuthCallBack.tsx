import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        // Refresh user from backend
        await fetchUser();
        // After successful fetch, redirect to dashboard
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("OAuth login failed:", err);
        navigate("/", { replace: true });
      }
    };
    handleLogin();
  }, [fetchUser, navigate]);

  return <p>Logging you in...</p>;
}
