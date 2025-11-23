import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

/**
 * GET /api/users/daily-login
 * Returns: streak, lastLogin, lastClaimedReward, loggedDates[]
 */
router.get("/daily-login", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();
    const lastLogin = user.lastActive?.toDate() || new Date(0);
    const lastClaimed = user.lastClaimedReward?.toDate() || new Date(0);

    res.json({
      streak: user.streak || 0,
      lastLogin: lastLogin.toISOString(),
      lastClaimedReward: lastClaimed.toISOString(),
      loggedDates: user.loggedDates || [],
    });
  } catch (err) {
    console.error("Daily login fetch error:", err);
    res.status(500).json({ error: "Failed to fetch streak" });
  }
});

/**
 * POST /api/users/daily-login
 * Claims daily XP reward
 */
router.post("/daily-login", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const lastClaimed = user.lastClaimedReward?.toDate() || new Date(0);

    // Already claimed today
    if (lastClaimed >= today) {
      return res.json({
        streak: user.streak || 0,
        xpEarned: 0,
        claimedToday: true,
      });
    }

    // Determine streak
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const lastLogin = user.lastActive?.toDate() || new Date(0);
    const continuedStreak =
      lastLogin >= yesterday && lastLogin < today
        ? (user.streak || 0) + 1
        : 1;

    // XP calculation: +5 base, +2 per streak, max +20 bonus
    const xpEarned = 5 + Math.min(continuedStreak * 2, 20);

    // Update user
    await userRef.update({
      streak: continuedStreak,
      xp: (user.xp || 0) + xpEarned,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      lastClaimedReward: admin.firestore.FieldValue.serverTimestamp(),
      loggedDates: admin.firestore.FieldValue.arrayUnion(
        today.toISOString().split("T")[0]
      ),
    });

    res.json({
      streak: continuedStreak,
      xpEarned,
      claimedToday: true,
      lastActive: now.toISOString(),
    });
  } catch (err) {
    console.error("Daily reward error:", err);
    res.status(500).json({ error: "Failed to claim reward" });
  }
});

export default router;
