import { useState, useEffect, useCallback } from "react";

// Type for consent status
interface ConsentStatus {
  agreedToPolicies: boolean;
}

// Hook
export function useConsent() {
  const [consent, setConsent] = useState<ConsentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current consent status
  const fetchConsentStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/consent/status", {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch consent status");
      }

      const data: ConsentStatus = await response.json();
      setConsent(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setConsent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Log consent
  const logConsent = useCallback(
    async (uid: string, email: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/consent/log-consent", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            email,
            agreed: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to log consent");
        }

        const data: ConsentStatus = await response.json();
        setConsent(data);
        return data;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchConsentStatus();
  }, [fetchConsentStatus]);

  return { consent, loading, error, fetchConsentStatus, logConsent };
}

export default useConsent;