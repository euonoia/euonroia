import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import sanitizeHtml from "sanitize-html";
import redisClient from "../../config/redisClient.js";

const router = express.Router();

/* -----------------------------
   1️⃣ Save logged-in quiz (existing)
------------------------------ */
router.post("/html-basics/quizzes", authMiddleware, async (req, res) => {
  try {
    let { htmlOutput } = req.body;
    if (!htmlOutput)
      return res.status(400).json({ error: "No HTML output provided" });

    htmlOutput = sanitizeHtml(htmlOutput, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "span"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        span: ["style"],
        div: ["style"],
      },
    });

    const uid = req.user?.uid;
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

/* -----------------------------
   2️⃣ Save guest quiz temporarily to Redis
       POST /api/lessons/html-basics/exam-pending
------------------------------ */
router.post("/html-basics/exam-pending", async (req, res) => {
  const { htmlOutput, sessionId } = req.body;
  if (!htmlOutput || !sessionId)
    return res.status(400).json({ error: "Missing data" });

  try {
    await redisClient.set(
      `guest:${sessionId}:exam`,
      JSON.stringify(htmlOutput),
      "EX",
      24 * 60 * 60 // expires in 24h
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to save guest exam:", err);
    res.status(500).json({ error: "Failed to save guest exam" });
  }
});

/* -----------------------------
   3️⃣ Claim guest exam after login
       POST /api/lessons/html-basics/claim-pending
------------------------------ */
router.post("/html-basics/claim-pending", authMiddleware, async (req, res) => {
  const { sessionId } = req.body;
  const uid = req.user?.uid;

  if (!sessionId || !uid)
    return res.status(400).json({ error: "Missing sessionId or user not logged in" });

  try {
    const exam = await redisClient.get(`guest:${sessionId}:exam`);
    if (!exam) return res.status(404).json({ error: "No pending exam found" });

    const htmlOutput = JSON.parse(exam);

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

    await redisClient.del(`guest:${sessionId}:exam`);

    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to claim guest exam:", err);
    res.status(500).json({ error: "Failed to claim guest exam" });
  }
});

export default router;
