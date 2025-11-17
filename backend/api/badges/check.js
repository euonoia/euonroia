import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// POST /api/badges/check
router.post("/check", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid; 
    const { badgeId } = req.body;

    if (!uid) return res.status(401).json({ error: "Unauthorized" });
    if (!badgeId) return res.status(400).json({ error: "Missing badgeId" });

    const db = admin.firestore();

    // Check if badge exists in central collection
    const badgeDoc = await db.collection("badges").doc(badgeId).get();
    if (!badgeDoc.exists) return res.status(404).json({ error: "Badge not found" });

    const badgeData = badgeDoc.data();

    // Check if user exists
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    // Award badge in user's subcollection
    const earnedBadgeRef = userRef.collection("earnedBadges").doc(badgeId);
    await earnedBadgeRef.set({
      ...badgeData,
      earnedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, awardedBadge: badgeId });
  } catch (err) {
    console.error("Failed to award badge:", err);
    res.status(500).json({ error: "Failed to award badge" });
  }
});

export default router;
