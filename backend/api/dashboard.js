// routes/dashboard.js
import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// GET /api/dashboard/progress
router.get("/progress", async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();

    // Get HTML Basics progress
    const quizDoc = await admin
      .firestore()
      .collection("lessons")
      .doc("html-basics")
      .collection("quizzes")
      .doc(uid)
      .get();

    const htmlBasicsProgress = quizDoc.exists && quizDoc.data().completed ? 100 : 0;

    res.json({
      displayName: userData.displayName,
      currentLesson: userData.currentLesson,
      htmlBasicsProgress,
    });
  } catch (err) {
    console.error("Failed to fetch dashboard progress:", err);
    res.status(500).json({ error: "Failed to fetch dashboard progress" });
  }
});

export default router;
