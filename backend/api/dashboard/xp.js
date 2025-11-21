import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// GET /api/milestones/xp
router.get("/xp", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();
    const xp = user.xp || 0;
    const level = user.level || Math.floor(xp / 100) + 1;

    res.json({ xp, level });
  } catch (err) {
    console.error("Failed to fetch XP:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
