import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// GET /api/leaderboard
router.get("/", /* authMiddleware, */ async (req, res) => {
  try {
    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .orderBy("xp", "desc")
      .limit(10) // Adjust as needed
      .get();

    const leaderboard = usersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        displayName: data.displayName || "Unknown",
        xp: data.xp ?? 0,
        level: data.level ?? 1,
      };
    });

    res.json({ leaderboard });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
