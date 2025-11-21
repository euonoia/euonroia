import React from "react";
import { FaTrophy } from "react-icons/fa";
import { LeaderboardUser } from "../types/leaderboard.types";

interface DashboardLeaderboardProps {
  leaderboard: LeaderboardUser[];
  loading: boolean;
}

const DashboardLeaderboard: React.FC<DashboardLeaderboardProps> = ({
  leaderboard,
  loading,
}) => {
  return (
    <div className="dashboard-bottom-right">
      <h2>
        <FaTrophy className="inline-icon" /> Leaderboard
      </h2>
      <p>Check your rank and challenge yourself against peers.</p>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <ol className="leaderboard-list">
          {leaderboard.map(user => (
            <li
              key={`${user.rank}-${user.displayName}`}
              className={`leaderboard-item ${user.xp === 0 ? "zero-xp" : ""}`}
            >
              <span className="leaderboard-rank">{user.rank}.</span>
              <span className="leaderboard-name">{user.displayName}</span>
              <span className="leaderboard-xp">{user.xp} XP</span>
              <span className="leaderboard-level">Lvl {user.level}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default DashboardLeaderboard;
