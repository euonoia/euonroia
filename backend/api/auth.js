// backend/api/auth.js
import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// -----------------------------
// 1️⃣ Redirect to Google
// -----------------------------
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

// -----------------------------
// 2️⃣ Handle Google callback
// -----------------------------
router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.redirect(FRONTEND_URL);

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = data;

    // Save/update user in Firestore
    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // Generate JWT
    const token = jwt.sign({ id, name, email, picture }, JWT_SECRET, { expiresIn: "7d" });

  res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(FRONTEND_URL);
  }
});

// -----------------------------
// 3️⃣ Protected route
// -----------------------------
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
