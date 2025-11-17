import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosClient";

interface Props {
  children: ReactNode;
}

const VerifyToken = ({ children }: Props) => {
  const navigate = useNavigate();
  const [userValid, setUserValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Read CSRF token from cookie
        const csrfToken = document.cookie
          .split("; ")
          .find(row => row.startsWith("csrfToken="))
          ?.split("=")[1];

        if (!csrfToken) throw new Error("No CSRF token found");

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
          {}, // empty body
          {
            withCredentials: true,
            headers: {
              "X-CSRF-Token": csrfToken,
            },
          }
        );

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
