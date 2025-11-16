import express from "express";
import admin from "firebase-admin";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .orderBy("xp", "desc")
      .limit(10) // increase if needed
      .get();

    const leaderboard = usersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        displayName: data.displayName || "Unknown",
        photoURL: data.photoURL || "/default-avatar.png",
        xp: data.xp ?? 0,
        level: data.level ?? 1,
      };
    });

    res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
