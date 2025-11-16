import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  children: ReactNode;
}

const VerifyToken = ({ children }: Props) => {
  const navigate = useNavigate();
  const [userValid, setUserValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          withCredentials: true,
        });
        setUserValid(true);
      } catch (err) {
        console.error("Token verification failed:", err);
        setUserValid(false);
        navigate("/", { replace: true }); // redirect to login/home
      }
    };

    verifyToken();
  }, [navigate]);

  if (!userValid) return null; // Will auto-redirect

  return <>{children}</>;
};

export default VerifyToken;
