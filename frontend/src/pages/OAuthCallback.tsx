// frontend/src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store JWT
      localStorage.setItem("authToken", token);
      // Clean URL
      window.history.replaceState({}, document.title, "/");
    }

    // Redirect to landing page or dashboard
    navigate("/");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Logging you in...</h2>
    </div>
  );
}
