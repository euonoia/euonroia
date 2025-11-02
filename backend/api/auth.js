// backend/api/auth.js
import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = process.env.VITE_FRONTEND_URL;

// Initialize Google OAuth2
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
    const { code } = req.query;
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

    // ✅ Store user session in HTTP-only cookie
    res.cookie("session", JSON.stringify({ id, name, email, picture }), {
      httpOnly: true,                     // cannot be read by JS
      secure: isProduction,               // HTTPS only in production
      sameSite: isProduction ? "none" : "lax", // must be none for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000,        // 1 day
    });

    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error("❌ Google OAuth error:", err);
    res.status(500).send("Google OAuth failed");
  }
});

// -----------------------------
// 3️⃣ Get current logged user
// -----------------------------
router.get("/me", (req, res) => {
  const cookie = req.cookies.session;
  if (!cookie) return res.status(401).json({ error: "Not logged in" });

  try {
    const user = JSON.parse(cookie);
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
});

// -----------------------------
// 4️⃣ Sign out
// -----------------------------
router.post("/signout", (req, res) => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.json({ success: true });
});

export default router;
