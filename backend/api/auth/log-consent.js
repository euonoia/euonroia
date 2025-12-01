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

router.post("/log", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user?.uid) {
      return res.status(401).json({ error: "Unauthenticated or missing UID" });
    }

    const uid = user.uid;

    // Fetch email from Firestore if not in JWT
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found in Firestore" });
    }

    const email = userDoc.data()?.email;
    if (!email) {
      return res.status(400).json({ error: "User email not found" });
    }

    const hashedIp = req.ip
      ? crypto.createHash("sha256").update(req.ip).digest("hex")
      : null;

    const consentsRef = admin.firestore().collection("consents");

    // Check if consent already exists
    const existing = await consentsRef.where("email", "==", email).limit(1).get();

    if (!existing.empty) {
      await admin.firestore().collection("users").doc(uid).set(
        { agreedToPolicies: true },
        { merge: true }
      );

      return res.json({
        message: "Consent already exists, user updated",
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

    // Update user record
    await admin.firestore().collection("users").doc(uid).set(
      { agreedToPolicies: true },
      { merge: true }
    );

    res.json({
      message: "Consent successfully registered",
      agreedToPolicies: true,
    });

  } catch (err) {
    console.error("Register consent error:", err);
    res.status(500).json({ error: "Failed to register consent", details: err.message });
  }
});


export default router;
