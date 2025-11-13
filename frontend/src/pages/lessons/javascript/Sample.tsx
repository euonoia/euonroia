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
    <div
      className="sample-page flex items-center justify-center min-h-screen bg-gray-50 p-4 text-center cursor-pointer"
      onClick={handleClick}
      role="button"
      aria-label="Go back to dashboard"
    >
      <div className="sample-card bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="sample-header flex items-center justify-center gap-3 mb-6">
          <FaBookOpen className="sample-icon text-indigo-600 text-5xl animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Euonoia</h1>
        </div>

        <p className="sample-message text-gray-700 text-lg mb-8">
          We’re currently making improvements to Euonroia.  
          Your learning experience is our priority.  
          Thank you for your understanding. Tap anywhere to return to the dashboard.
        </p>

        <div className="sample-status flex flex-col items-center text-gray-500">
          <FaHourglassHalf className="sample-hourglass text-3xl animate-spin-slow mb-2" />
          <span className="text-sm">Working on this now...</span>
        </div>
      </div>
    </div>
  );
};

export default Sample;
