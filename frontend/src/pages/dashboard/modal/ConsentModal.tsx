import React, { useState } from "react";
import { Link } from "react-router-dom"; // <-- import Link
import "../../../styles/policy/policy.css";

type Props = {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
};

const ConsentModal: React.FC<Props> = ({ isOpen, onAccept, onCancel }) => {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="policy-modal-overlay">
      <div className="policy-modal-card">
        <h2>Terms & Policies</h2>

        {/* Scrollable policy text */}
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
            Welcome to our platform. By using our service, you agree to follow all policies and
            guidelines. You can read the full documents{" "}
            <Link to="/policies/privacy">here (Privacy Policy)</Link>,{" "}
            <Link to="/policies/terms">here (Terms of Service)</Link>, and{" "}
            <Link to="/policies/cookies">here (Cookie Policy)</Link>.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus mauris non
            faucibus viverra. Curabitur vel eros vel sapien gravida tincidunt.
          </p>
        </div>

        {/* Checkbox */}
        <label className="policy-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          I have read and agree to the terms and policies
        </label>

        {/* Buttons */}
        <div className="policy-buttons">
          <button
            className="btn-primary"
            disabled={!checked}
            onClick={onAccept}
          >
            I Agree
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
