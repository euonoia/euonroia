import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const uid = req.user?.uid;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const userRef = admin.firestore().collection("users").doc(uid);
  await userRef.update({
    lastActive: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ success: true });
});

export default router;
