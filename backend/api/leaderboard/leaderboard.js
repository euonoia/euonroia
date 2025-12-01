import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import { getLevelFromXP } from "../../utils/levelingup.js"; // ESM import

const router = express.Router();

// GET /api/leaderboard (only for logged-in users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .orderBy("xp", "desc")
      .limit(10)
      .get();

    const leaderboard = [];

    for (const [index, doc] of usersSnapshot.docs.entries()) {
      const data = doc.data();
      const xp = data.xp ?? 0;
      const level = getLevelFromXP(xp); // calculate level dynamically

      // Optional: if level is different from stored level, update Firestore
      if (level !== (data.level ?? 1)) {
        await doc.ref.set({ level }, { merge: true });
      }

      leaderboard.push({
        rank: index + 1,
        displayName: data.displayName || "Unknown",
        xp,
        level,
      });
    }

    res.json({ leaderboard });
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
