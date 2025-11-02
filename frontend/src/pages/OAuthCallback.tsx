// frontend/src/pages/OAuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("jwt", token); // save JWT for API calls
    }
    navigate("/"); // redirect to home
  }, [navigate]);

  return <div>Logging in...</div>;
}
