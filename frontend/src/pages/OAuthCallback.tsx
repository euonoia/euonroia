// frontend/src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      window.history.replaceState({}, document.title, "/"); // clean URL
    }

    navigate("/"); // redirect to home
  }, [navigate]);

  return <div>Logging you in...</div>;
}
