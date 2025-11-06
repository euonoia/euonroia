import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        await fetchUser(); // check backend for logged-in user
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

export default OAuthCallback;
