import express from "express";
import admin from "firebase-admin";
import sanitizeHtml from "sanitize-html";
import { authMiddleware } from "../../middlewares/auth.js";

const router = express.Router();

// POST /api/lessons/javascript/quizzes
router.post("/javascript/quizzes", authMiddleware, async (req, res) => {
  try {
    const { jsOutput } = req.body;

    if (!jsOutput) {
      return res.status(400).json({ error: "No JS output provided" });
    }

    const uid = req.user.uid; // guaranteed by authMiddleware
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    // Sanitize JS output to prevent unsafe content
    const sanitizedOutput = sanitizeHtml(jsOutput, {
      allowedTags: [], // no HTML tags allowed
      allowedAttributes: {},
    });

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
        jsOutput: sanitizedOutput,
        score: 100, // can add actual scoring logic here
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
