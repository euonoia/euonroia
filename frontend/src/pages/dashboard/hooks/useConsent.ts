import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../../context/UserContext";

// Type for consent status
interface ConsentStatus {
  agreedToPolicies: boolean;
}

// Hook
export function useConsent(isOpen: boolean) {
  const { user } = useUser();
  const [consent, setConsent] = useState<ConsentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/consent/status`, {
        withCredentials: true,
      })
      .then((res) => {
        setConsent(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch consent status:", err);
        setError(err.message || "Unknown error");
        setConsent(null);
      })
      .finally(() => setLoading(false));
  }, [isOpen, user]);

  return { consent, loading, error };
}

export default useConsent;
