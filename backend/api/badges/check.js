import express from "express";
import admin from "firebase-admin";

const router = express.Router();

router.post("/check", async (req, res) => {
  try {
    const { uid, badgeId } = req.body;

    if (!uid) return res.status(400).json({ error: "Missing user uid" });
    if (!badgeId) return res.status(400).json({ error: "Missing badgeId" });

    const db = admin.firestore();

    const badgeDoc = await db.collection("badges").doc(badgeId).get();
    if (!badgeDoc.exists) return res.status(404).json({ error: "Badge not found" });

    const badgeData = badgeDoc.data();

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    // Update only the earned badge for this user
    const earnedBadgeRef = userRef.collection("earnedBadges").doc(badgeId);
    await earnedBadgeRef.set({
      ...badgeData,
      earnedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, awardedBadge: badgeId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to award badge" });
  }
});

export default router;
