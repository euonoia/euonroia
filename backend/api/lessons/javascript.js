import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// POST /api/lessons/javascript/quizzes
router.post("/javascript/quizzes", async (req, res) => {
  try {
    const { jsOutput } = req.body;

    if (!jsOutput) return res.status(400).json({ error: "No JS output provided" });

    const uid = req.user?.uid; // extracted from JWT/session
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const quizRef = admin
      .firestore()
      .collection("lessons")
      .doc("javascript")
      .collection("quizzes")
      .doc(uid);

    await quizRef.set(
      {
        uid,
        completed: true,
        jsOutput,
        score: 100, // you can adjust scoring logic if needed
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save JS quiz:", err);
    res.status(500).json({ error: "Failed to save JS quiz" });
  }
});

export default router;
