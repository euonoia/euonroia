import { useEffect, useState } from "react";
import axios from "../../../utils/axiosClient";
import { LeaderboardUser } from "../types/leaderboard.types";

export const useDashboardLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get<{ leaderboard: LeaderboardUser[] }>(
          `${import.meta.env.VITE_BACKEND_URL}/api/leaderboard`,
          { withCredentials: true }
        );

        const formatted = res.data.leaderboard.map((u, index) => ({
          rank: index + 1,
          displayName: u.displayName || "Unknown",
          photoURL: u.photoURL || "/default-avatar.png",
          xp: u.xp ?? 0,
          level: u.level ?? 1,
        }));

        setLeaderboard(formatted);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return { leaderboard, loadingLeaderboard };
};

export default useDashboardLeaderboard;