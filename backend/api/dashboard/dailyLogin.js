import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// POST /api/milestones/daily-login
router.post("/daily-login", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();
    const lastClaimed = user.lastClaimedReward?.toDate() || new Date(0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lastClaimed >= today) {
      return res.status(400).json({ error: "Reward already claimed today", streak: user.streak || 0, xpEarned: 0 });
    }

    const lastLogin = user.lastLogin?.toDate() || new Date(0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let newStreak = lastLogin >= yesterday && lastLogin < today ? (user.streak || 0) + 1 : 1;
    const dailyXP = 5 + Math.min(newStreak * 2, 20);

    await userRef.update({
      streak: newStreak,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
      lastClaimedReward: admin.firestore.FieldValue.serverTimestamp(),
      xp: (user.xp || 0) + dailyXP,
    });

    res.json({ streak: newStreak, xpEarned: dailyXP, lastClaimedReward: new Date().toISOString() });
  } catch (err) {
    console.error("Daily login failed:", err);
    res.status(500).json({ error: "Failed to process daily login" });
  }
});

export default router;
