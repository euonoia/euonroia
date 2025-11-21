import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid; 
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const db = admin.firestore();

    // 1️⃣ Get all earned badges from user's subcollection
    const earnedSnap = await db
      .collection("users")
      .doc(uid)
      .collection("earnedBadges")
      .get();

    if (earnedSnap.empty) {
      return res.json({ success: true, earnedBadges: [] });
    }

    const earnedBadgeIds = new Set(earnedSnap.docs.map(doc => doc.id));

    // 2️⃣ Get all badges from central badges collection
    const badgeSnap = await db.collection("badges").get();
    const earnedBadges = badgeSnap.docs
      .filter(doc => earnedBadgeIds.has(doc.id))
      .map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ success: true, earnedBadges });
  } catch (err) {
    console.error("Failed to fetch earned badges:", err);
    res.status(500).json({ error: "Failed to fetch earned badges" });
  }
});

export default router;
