import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// GET /api/dashboard/progress
router.get("/progress", async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const db = admin.firestore();

    // Fetch user info
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();

    // Helper to check quiz completion
    const getLessonProgress = async (lessonId) => {
      const quizDoc = await db
        .collection("lessons")
        .doc(lessonId)
        .collection("quizzes")
        .doc(uid)
        .get();
      return quizDoc.exists && quizDoc.data()?.completed ? 100 : 0;
    };

    // ✅ Include HTML, CSS, and JS progress
    const [htmlBasicsProgress, cssBasicsProgress, javascriptProgress] = await Promise.all([
      getLessonProgress("html-basics"),
      getLessonProgress("css-basics"),
      getLessonProgress("javascript"),
    ]);

    res.json({
      displayName: userData?.displayName || "Guest",
      currentLesson: userData?.currentLesson || "",
      htmlBasicsProgress,
      cssBasicsProgress,
      javascriptProgress,
    });
  } catch (err) {
    console.error("Failed to fetch dashboard progress:", err);
    res.status(500).json({ error: "Failed to fetch dashboard progress" });
  }
});

export default router;
