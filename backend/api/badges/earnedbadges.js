import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// POST /api/badges/earned
router.post("/earned", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid; // ✅ Always from authMiddleware
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const db = admin.firestore();

    // 1️⃣ Get all earned badges from user's subcollection
    const earnedSnap = await db
      .collection("users")
      .doc(uid)
      .collection("earnedBadges")
      .get();

    const earnedBadgeIds = earnedSnap.docs.map(doc => doc.id);

    if (earnedBadgeIds.length === 0) {
      return res.json({ success: true, earnedBadges: [] });
    }

    // 2️⃣ Get all badges from central badges collection
    const badgeSnap = await db.collection("badges").get();
    const allBadges = badgeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3️⃣ Filter only the badges the user has earned
    const earnedBadges = allBadges.filter(badge => earnedBadgeIds.includes(badge.id));

    res.json({ success: true, earnedBadges });
  } catch (err) {
    console.error("Failed to fetch earned badges:", err);
    res.status(500).json({ error: "Failed to fetch earned badges" });
  }
});

export default router;
