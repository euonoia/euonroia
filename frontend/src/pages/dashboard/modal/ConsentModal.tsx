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
            Before continuing, please review and accept our platform policies. These
            policies explain how we handle your data, how you are expected to use our
            services, and your rights as a user. By proceeding, you acknowledge that you
            have read, understood, and agreed to the following documents:
          </p>

          <ul style={{ marginLeft: "1.25rem", marginBottom: "1rem" }}>
            <li>
              <Link to="/policies/terms">Terms of Service</Link> – Outlines acceptable use,
              account rules, responsibilities, and limitations of liability.
            </li>
            <li>
              <Link to="/policies/privacy">Privacy Policy</Link> – Explains what data we
              collect, why we collect it, and how it is stored and protected.
            </li>
            <li>
              <Link to="/policies/cookies">Cookie Policy</Link> – Describes how cookies and
              tracking technologies are used to improve your experience.
            </li>
          </ul>

          <p>
            By checking the box below and clicking <strong>"I Agree"</strong>, you confirm
            that you accept these policies and consent to the processing of your data as
            described. If you do not agree, you may close this window and discontinue the
            use of the service.
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
