import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.replaceState({}, document.title, "/");
    navigate("/dashboard");
  }, [navigate]);

  return <p>Logging you in...</p>;
}
