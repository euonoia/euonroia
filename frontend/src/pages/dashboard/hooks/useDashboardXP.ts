import { useEffect, useState } from "react";
import axios from "../../../utils/axiosClient";

export const useDashboardXP = (user: any) => {
  const [xp, setXP] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    if (!user) return;

    const fetchXP = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/milestones/xp`,
          { withCredentials: true }
        );
        setXP(res.data.xp);
        setLevel(res.data.level);
      } catch (err) {
        console.error("Failed to fetch user XP:", err);
      }
    };

    fetchXP();
  }, [user]);

  return { xp, level };
};

export default useDashboardXP;