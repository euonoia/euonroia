import { Router } from "express";
import admin from "firebase-admin";
import crypto from "crypto";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.get("/status", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    if (!uid) return res.status(400).json({ error: "User not found" });

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User document not found" });
    }

    const agreedToPolicies = userSnap.data()?.agreedToPolicies || false;

    res.json({ agreedToPolicies });
  } catch (err) {
    console.error("Failed to get consent status:", err);
    res.status(500).json({ error: "Failed to fetch consent status" });
  }
});

router.post("/log-consent", authMiddleware, async (req, res) => {
  try {
    const { uid, email, agreed } = req.body;

    if (!uid || !email || !agreed) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash IP for privacy
    const hashedIp = req.ip
      ? crypto.createHash("sha256").update(req.ip).digest("hex")
      : null;

    const consentsRef = admin.firestore().collection("consents");

    // Check for existing consent
    const existing = await consentsRef.where("email", "==", email).limit(1).get();

    if (!existing.empty) {
      // Already agreed — update user just in case & return
      await admin.firestore().collection("users").doc(uid).set(
        { agreedToPolicies: true },
        { merge: true }
      );

      return res.json({
        message: "Consent already exists, no duplicate created",
        agreedToPolicies: true,
      });
    }

    // Create new consent record
    await consentsRef.add({
      uid,
      email,
      agreed: true,
      timestamp: admin.firestore.Timestamp.now(),
      ip: hashedIp,
      userAgent: req.headers["user-agent"] || null,
    });

    // Mark user as agreed
    await admin.firestore().collection("users").doc(uid).set(
      { agreedToPolicies: true },
      { merge: true }
    );

    res.json({
      message: "Consent logged and linked to user",
      agreedToPolicies: true,
    });

  } catch (err) {
    console.error("Consent logging error:", err);
    res.status(500).json({ error: "Failed to log consent" });
  }
});


export default router;
