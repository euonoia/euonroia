import { Router } from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js";
import { verifyCsrfToken } from "../../middlewares/csrfVerify.js";

const router = Router();

router.post("/", authMiddleware, verifyCsrfToken, async (req, res) => {
  const uid = req.user?.uid;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.update({
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating lastActive:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
