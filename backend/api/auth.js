import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";

const router = Router();

// Initialize Google OAuth2 client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback"
);

// 1️⃣ Verify ID token (for Firebase-based auth)
router.post("/verify", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    await admin.firestore().collection("users").doc(uid).set(
      { uid, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    res.json({ user: { uid, name, email, picture } });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// 2️⃣ Redirect user to Google OAuth login
router.get("/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(url);
});

// 3️⃣ Handle Google callback and fetch user info
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Fetch user profile
    const response = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });
    const { id, name, email, picture } = response.data;

    // Save or update user in Firestore
    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // Redirect or return JSON
    res.json({
      success: true,
      user: { id, name, email, picture },
    });
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).json({ error: "Google OAuth failed" });
  }
});

export default router;
