import React from "react";
import { Badge } from "../types/badge.types";

interface DashboardAchievementsProps {
  badges: Badge[];
  loading: boolean;
}

const DashboardAchievements: React.FC<DashboardAchievementsProps> = ({
  badges,
  loading,
}) => {
  return (
    <div className="dashboard-bottom-left">
      <h2>Achievements</h2>
      <p>Track badges and milestones earned as you progress.</p>

      {loading ? (
        <p>Loading badges...</p>
      ) : badges.length === 0 ? (
        <p>No badges earned yet.</p>
      ) : (
        <div className="badges-grid">
          {badges.map(badge => (
            <div key={badge.id} className="badge-card">
              <span className="badge-icon">{badge.icon}</span>
              <div>
                <h4>{badge.title}</h4>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardAchievements;
