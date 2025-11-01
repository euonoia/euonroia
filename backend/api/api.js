import { Router } from "express";
import admin from "firebase-admin";
import { checkAuth } from "../middleware/auth.js";

const router = Router();

// Example: Get dashboard data
router.get("/dashboard", checkAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snapshot = await admin.firestore().collection("dashboard").doc(uid).get();

    res.json({
      user: { uid: req.user.uid, name: req.user.name, email: req.user.email },
      dashboard: snapshot.exists ? snapshot.data() : {},
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard:", err);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// Example: Update user settings
router.post("/settings", checkAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    await admin.firestore().collection("settings").doc(uid).set(req.body, { merge: true });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving settings:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
