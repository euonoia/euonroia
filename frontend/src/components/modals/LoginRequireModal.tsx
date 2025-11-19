import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/modals/LoginRequireModal.css"; // keep your CSS

interface Props {
  onLogin: () => void;
}

export default function LoginRequiredModal({ onLogin }: Props) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/"); // redirect to home
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-box">
        <h2>Save Your Progress</h2>
        <p>You must be logged in to save your exam results.</p>

        <div className="login-modal-actions">
          <button className="login-btn" onClick={onLogin}>
            Continue with Google
          </button>
          <button className="cancel-btn" onClick={handleClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
