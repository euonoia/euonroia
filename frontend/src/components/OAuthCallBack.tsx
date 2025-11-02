import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
    }
    // Remove token from URL for cleanliness
    window.history.replaceState({}, document.title, "/");
    navigate("/"); // redirect to landing page or dashboard
  }, [navigate]);

  return <p>Logging you in...</p>;
}
