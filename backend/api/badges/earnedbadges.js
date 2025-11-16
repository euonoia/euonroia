import express from "express";
import admin from "firebase-admin";

const router = express.Router();

router.post("/earned", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "Missing user uid" });

    const db = admin.firestore();

    // 1️⃣ Get all earned badges from the subcollection
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
    const allBadges = badgeSnap.docs.map(doc => doc.data());

    // 3️⃣ Filter only the badges the user has earned
    const earnedBadges = allBadges.filter(badge => earnedBadgeIds.includes(badge.id));

    res.json({ success: true, earnedBadges });
  } catch (err) {
    console.error("Failed to fetch earned badges:", err);
    res.status(500).json({ error: "Failed to fetch earned badges" });
  }
});

export default router;
