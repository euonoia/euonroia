import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import sanitizeHtml from "sanitize-html";

const router = express.Router();

// POST /api/lessons/html-basics/quizzes
router.post("/html-basics/quizzes", authMiddleware, async (req, res) => {
  try {
    let { htmlOutput } = req.body;

    if (!htmlOutput)
      return res.status(400).json({ error: "No HTML output provided" });

    // --- Sanitize user-submitted HTML ---
    htmlOutput = sanitizeHtml(htmlOutput, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "span"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        span: ["style"],
        div: ["style"],
      },
    });

    const uid = req.user?.uid; // from JWT payload
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const quizRef = admin
      .firestore()
      .collection("lessons")
      .doc("html-basics")
      .collection("quizzes")
      .doc(uid);

    await quizRef.set(
      {
        uid,
        completed: true,
        htmlOutput,
        score: 100,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save quiz:", err);
    res.status(500).json({ error: "Failed to save quiz" });
  }
});

export default router;
