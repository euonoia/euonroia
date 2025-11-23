import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import axios from "axios";
import "../../../styles/policy/policy.css";

interface Props {
  isOpen: boolean;
  onClose: () => void; 
}


export default function ConsentModal({ isOpen, onClose }: Props) {
  const { user, fetchUser } = useUser();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleAgree = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/consent/log-consent`,
        {
          uid: user.uid,
          email: user.email,
          agreed: true,
        },
        { withCredentials: true }
      );

      // Refresh user info to update agreedToPolicies
      fetchUser?.();

      onClose(); // close modal after agreeing
    } catch (err) {
      console.error("Consent logging failed:", err);
      alert("Failed to record consent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-modal-overlay">
      <div className="policy-modal-card">
        <h2>Terms & Policies</h2>

        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid var(--color-border)",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <p>
            Welcome! By using our service, you agree to follow all policies. Read the full documents{" "}
            <Link to="/policies/privacy">here (Privacy Policy)</Link>,{" "}
            <Link to="/policies/terms">here (Terms of Service)</Link>, and{" "}
            <Link to="/policies/cookies">here (Cookie Policy)</Link>.
          </p>
        </div>

        <label className="policy-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I have read and agree to the policies
        </label>

        <div className="policy-buttons">
          <button
            className="btn-primary"
            disabled={!agreed || loading}
            onClick={handleAgree}
          >
            {loading ? "Processing..." : "I Agree"}
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
