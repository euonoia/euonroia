import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store Firebase custom token
      localStorage.setItem("idToken", token);

      // Optionally, post message if opened as popup
      if (window.opener) {
        window.opener.postMessage({ user: { token } }, window.location.origin);
        window.close();
      } else {
        navigate("/dashboard");
      }
    } else {
      // No token, redirect to login
      navigate("/");
    }
  }, []);

  return <div>Logging in...</div>;
}
