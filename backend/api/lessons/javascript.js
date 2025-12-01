import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import { getLevelFromXP } from "../../utils/levelingup.js";

const router = express.Router();

router.post("/javascript/quizzes", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const quizRef = admin
      .firestore()
      .collection("lessons")
      .doc("javascript")
      .collection("quizzes")
      .doc(uid);

    const quizDoc = await quizRef.get();
    let xpAdded = false;
    let levelUp = false;

    if (!quizDoc.exists || !quizDoc.data()?.completed) {
      await quizRef.set({ uid, completed: true, score: 100, timestamp: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

      const userRef = admin.firestore().collection("users").doc(uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data() || { xp: 0, level: 1 };
      const newXP = (userData.xp || 0) + 25;
      const newLevel = getLevelFromXP(newXP);

      if (newLevel > (userData.level || 1)) levelUp = true;

      await userRef.set({ xp: newXP, level: newLevel }, { merge: true });
      xpAdded = true;
    }

    res.json({ success: true, xpAdded, levelUp });
  } catch (err) {
    console.error("Failed to save JS quiz or add XP:", err);
    res.status(500).json({ error: "Failed to save JS quiz or add XP" });
  }
});

export default router;
