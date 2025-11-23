import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

interface Props {
  onClose: () => void;
}

export default function PolicyConsentModal({ onClose }: Props) {
  const { user, fetchUser } = useUser();
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // 1️⃣ Check consent status on mount
  useEffect(() => {
    const checkConsentStatus = async () => {
      if (!user) {
        setCheckingStatus(false);
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/auth/consent/status`, {
          withCredentials: true,
        });

        if (res.data?.agreedToPolicies) {
          onClose(); // already agreed, close modal
        }
      } catch (err) {
        console.error("Failed to fetch consent status:", err);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkConsentStatus();
  }, [user, onClose]);

  // 2️⃣ Handle agree button
  const handleAgree = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/auth/consent/log-consent`,
        {
          uid: user.uid,
          email: user.email,
          agreed: true,
          timestamp: new Date().toISOString(),
        },
        { withCredentials: true }
      );

      // Refresh user info to update agreedToPolicies
      await fetchUser();

      // Close modal if backend confirms
      if (res.data?.agreedToPolicies) {
        onClose();
      }
    } catch (err) {
      console.error("Consent logging failed:", err);
      alert("Failed to record consent. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Hide modal if user is null, already agreed, or still checking status
  if (!user || checkingStatus) return null;

  return (
    <div
      className="policy-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="policy-modal-card"
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "2rem",
          borderRadius: "1rem",
          width: "90%",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h2>Policies Agreement</h2>
        <p>
          Please agree to our <a href="/privacy">Privacy Policy</a> and{" "}
          <a href="/terms">Terms of Service</a> to continue.
        </p>
        <label
          className="policy-checkbox"
          style={{ display: "block", margin: "1rem 0", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginRight: "0.5rem" }}
          />
          I agree to the policies
        </label>
        <div
          className="policy-buttons"
          style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
        >
          <button
            className="btn btn-primary"
            onClick={handleAgree}
            disabled={!agreed || loading}
          >
            {loading ? "Processing..." : "Agree and Continue"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
