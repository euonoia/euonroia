import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL
    : "https://euonroia-secured.onrender.com";

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign in...");
  const maxAttempts = 6;
  const baseDelayMs = 500;

  useEffect(() => {
    let mounted = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const tryFetchMe = async (): Promise<boolean> => {
      try {
        const res = await axios.get<{ user: any }>(`${BACKEND_URL}/auth/me`, {
          withCredentials: true,
          timeout: 3000,
        });
        return !!res?.data?.user;
      } catch {
        return false;
      }
    };

    (async () => {
      setMessage("Completing login — checking authentication...");
      for (let i = 0; i < maxAttempts && mounted; i++) {
        const ok = await tryFetchMe();
        if (ok) {
          if (!mounted) return;
          setMessage("Login successful — redirecting...");
          await sleep(300);
          navigate("/dashboard");
          return;
        }
        const delay = baseDelayMs * (i + 1);
        setMessage(`Waiting for login to complete... (attempt ${i + 1}/${maxAttempts})`);
        await sleep(delay);
      }

      if (!mounted) return;
      setMessage("Login failed — redirecting to home.");
      await sleep(600);
      navigate("/");
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{message}</h2>
      <p>If you are not redirected automatically, try refreshing or logging in again.</p>
    </div>
  );
};

export default OAuthCallback;
