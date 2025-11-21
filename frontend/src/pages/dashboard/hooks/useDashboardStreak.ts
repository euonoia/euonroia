import { useEffect, useState } from "react";
import axios from "../../../utils/axiosClient";

export const useDashboardStreak = (user: any) => {
  const [streak, setStreak] = useState<number>(0);
  const [lastActive, setLastActive] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const fetchStreak = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/milestones/streak`,
          { withCredentials: true }
        );

        setStreak(res.data.streak || 0);
        setLastActive(res.data.lastActive || "");
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    };

    fetchStreak();
  }, [user]);

  return { streak, lastActive };
};

export default useDashboardStreak;