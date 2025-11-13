import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaHourglassHalf } from "react-icons/fa";
import "../../../styles/maintenance/Sample.css";

const Sample: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="sample-page">
      <div className="sample-card" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="sample-header">
          <FaBookOpen className="sample-icon" />
          <h1>Euonoia</h1>
        </div>

        <p className="sample-message">
          is currently doing school work 🧠📚
          <br />
          Thank you for your patience and understanding.
        </p>

        <div className="sample-status">
          <FaHourglassHalf className="sample-hourglass" />
          <span>Working on this now...</span>
        </div>
      </div>
    </div>
  );
};

export default Sample;
