// routes/preloadSnippets.js
import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import sanitizeHtml from "sanitize-html";
import crypto from "crypto";

const router = express.Router();

router.post("/preload-snippets", authMiddleware, async (req, res) => {
  try {
    const { snippets } = req.body;
    const uid = req.user?.uid;

    if (!uid) return res.status(401).json({ error: "Unauthorized" });
    if (!Array.isArray(snippets) || snippets.length === 0)
      return res.status(400).json({ error: "No snippets provided" });

    // Sanitize, trim, and filter empty code
    const cleanedSnippets = snippets
      .map((s) => ({
        code: s.code ? sanitizeHtml(s.code).trim() : "",
        type: s.type || "Unknown",
        explanation: s.explanation ? sanitizeHtml(s.explanation) : "",
        tags: Array.isArray(s.tags) ? s.tags : [],
        language: s.language || "unknown",
        contributedBy: uid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }))
      .filter((s) => s.code !== "");

    const collectionRef = admin.firestore().collection("codeSnippets");
    const chunkSize = 500;
    let savedCount = 0;

    // Write in batches
    for (let i = 0; i < cleanedSnippets.length; i += chunkSize) {
      const batch = admin.firestore().batch();
      const chunk = cleanedSnippets.slice(i, i + chunkSize);

      chunk.forEach((snippet) => {
        // Use hash of code as document ID for deduplication
        const docId = crypto.createHash("sha256").update(snippet.code).digest("hex");
        batch.set(collectionRef.doc(docId), snippet, { merge: true }); // merge to avoid overwriting existing fields
      });

      await batch.commit();
      savedCount += chunk.length;
    }

    res.json({ success: true, requested: snippets.length, saved: savedCount });
  } catch (err) {
    console.error("Failed to preload snippets:", err);
    res.status(500).json({ error: "Failed to preload snippets", details: err.message });
  }
});

export default router;
