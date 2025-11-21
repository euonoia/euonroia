import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// GET /api/milestones/streak
router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();
    const lastActive = userData.lastActive?.toDate() || null;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let streak = userData.streak || 0;

    if (lastActive) {
      const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const diffDays = (todayStart - last) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) streak += 1;
      else if (diffDays > 1) streak = 0;
    } else {
      streak = 1;
    }

    await userRef.update({ streak, lastActive: today });

    res.json({ message: "Streak updated", streak, lastActive: today });
  } catch (err) {
    console.error("Failed to update streak:", err);
    res.status(500).json({ error: "Failed to update streak" });
  }
});

export default router;
