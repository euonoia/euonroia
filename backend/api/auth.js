// backend/api/auth.js
import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";

const router = Router();

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

// Load environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Determine redirect URIs dynamically
const GOOGLE_REDIRECT_URI = isProduction
  ? process.env.GOOGLE_REDIRECT_URI || "https://euonroia-backend.onrender.com/auth/google/callback"
  : "http://localhost:5000/auth/google/callback";

const FRONTEND_URL = isProduction
  ? process.env.VITE_FRONTEND_URL || "https://euonroia.onrender.com"
  : "http://localhost:5173";

// Initialize Google OAuth2 client
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// -----------------------------
// 1️⃣ Redirect to Google OAuth
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

  console.log("🔗 Redirecting to Google OAuth URL:", url);
  res.redirect(url);
});

// -----------------------------
// 2️⃣ Google callback
// -----------------------------
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      console.warn("⚠️ /auth/google/callback accessed without code");
      return res.redirect(FRONTEND_URL);
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const response = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });
    const { id, name, email, picture } = response.data;

    // Save/update user in Firestore
    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // ✅ Store user info in HTTP-only, cross-site cookie
    res.cookie("session", JSON.stringify({ uid: id, name, email, picture }), {
      httpOnly: true,
      secure: isProduction,      // must be true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax", // allow cross-domain on deployed
    });

    // Redirect to frontend
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error("❌ Google OAuth error:", err);
    res.status(500).send("Google OAuth failed. Please try again.");
  }
});

// -----------------------------
// 3️⃣ Get current logged-in user
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
