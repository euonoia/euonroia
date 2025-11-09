import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://euonroia-secured.onrender.com";

/**
 * OAuthCallback page
 * - Polls /auth/me a few times because the cookie may arrive slightly after redirect.
 * - Navigates to /dashboard on success, or / on failure.
 */
const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign in...");
  const maxAttempts = 6;
  const baseDelayMs = 500; // initial delay, increases

  useEffect(() => {
    let mounted = true;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const tryFetchMe = async (): Promise<boolean> => {
      try {
        const res = await axios.get<{ user: any }>(`${BACKEND_URL}/auth/me`, {
          withCredentials: true,
          // small timeout so we don't hang long on each try
          timeout: 3000,
        });
        // If backend returns user, success
        if (res?.data?.user) return true;
        return false;
      } catch (err) {
        // If 401 or other error, return false and let caller retry
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
          // small delay so UI shows success
          await sleep(300);
          navigate("/dashboard");
          return;
        }
        const delay = baseDelayMs * (i + 1); // linear backoff
        setMessage(`Waiting for login to complete... (attempt ${i + 1}/${maxAttempts})`);
        await sleep(delay);
      }

      // If we get here, attempts exhausted
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
