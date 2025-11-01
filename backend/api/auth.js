import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";

const router = Router();

// Use environment variables for flexibility
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback";

const FRONTEND_URL = process.env.VITE_FRONTEND_URL || "http://localhost:5173";

// Initialize Google OAuth2 client
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// 1️⃣ Verify Firebase ID token (optional)
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

  console.log("Redirecting to Google OAuth URL:", url);
  res.redirect(url);
});

// 3️⃣ Handle Google callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error("Missing authorization code from Google");

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const response = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = response.data;

    // Save/update user in Firestore
    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // Generate Firebase custom token for frontend
    const firebaseToken = await admin.auth().createCustomToken(id);

    // Redirect popup to frontend
    const redirectUrl = `${FRONTEND_URL}/oauth-callback?token=${firebaseToken}`;
    console.log("Redirecting to frontend:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.status(500).send("Google OAuth failed");
  }
});

export default router;
