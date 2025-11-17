import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import sanitizeHtml from "sanitize-html"; 

const router = express.Router();

// POST /api/lessons/css-basics/quizzes
router.post("/css-basics/quizzes", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid; // always trusted from middleware
    const { htmlOutput } = req.body;

    if (!htmlOutput || typeof htmlOutput !== "string") {
      return res.status(400).json({ error: "No HTML output provided" });
    }

    // ✅ Sanitize HTML to prevent XSS
   const sanitizedHtml = sanitizeHtml(htmlOutput, {
    allowedTags: ['p','div','span','img','a'],
    allowedAttributes: {
      a: ['href', 'target'],
      img: ['src','alt'],
    },
  });

    const quizRef = admin
      .firestore()
      .collection("lessons")
      .doc("css-basics")
      .collection("quizzes")
      .doc(uid);

    await quizRef.set(
      {
        uid,
        completed: true,
        htmlOutput: sanitizedHtml,
        score: 100, // you can replace this with a real server-side score calculation later
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save CSS quiz:", err);
    res.status(500).json({ error: "Failed to save CSS quiz" });
  }
});

export default router;
