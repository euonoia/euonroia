import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clean the URL (remove query params)
    window.history.replaceState({}, document.title, "/");

    // Simply redirect to dashboard; backend cookie already contains auth
    navigate("/dashboard");
  }, [navigate]);

  return <p>Logging you in...</p>;
}
