import { useEffect, useState } from "react";
import axios from "../../../utils/axiosClient";
import { Badge } from "../types/badge.types";

export const useDashboardBadges = (user: any) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBadges = async () => {
      try {
        const res = await axios.post<{ earnedBadges: Badge[] }>(
          `${import.meta.env.VITE_BACKEND_URL}/api/badgesEarned/earned`,
          { uid: user.id },
          { withCredentials: true }
        );
        setBadges(res.data.earnedBadges || []);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      } finally {
        setLoadingBadges(false);
      }
    };

    fetchBadges();
  }, [user]);

  return { badges, loadingBadges };
};

export default useDashboardBadges;