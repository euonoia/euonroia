import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET;

// Determine frontend callback URL
const FRONTEND_URL = isProduction
  ? "https://euonroia.onrender.com"
  : "http://localhost:5173";

// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  isProduction
    ? "https://euonroia-secured.onrender.com/auth/google/callback"
    : "http://localhost:5000/auth/google/callback"
);

// --- 1️⃣ Redirect to Google ---
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

// --- 2️⃣ OAuth callback ---
router.get("/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.redirect(FRONTEND_URL);

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = data;

    // Save to Firebase
    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // Create JWT token
    const token = jwt.sign({ id, name, email, picture }, JWT_SECRET, { expiresIn: "7d" });

    // Set HTTP-only cookie
   res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,            
      sameSite: "None",         
      domain: ".onrender.com",  
      path: "/",               
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Cookie set — redirecting to:", `${FRONTEND_URL}/dashboard`);

    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("❌ OAuth callback error:", err);
    res.redirect(FRONTEND_URL);
  }
});

// --- 3️⃣ Protected route ---
router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: "Not logged in" });
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- 4️⃣ Logout ---
router.post("/signout", (req, res) => {
  res.clearCookie("authToken", {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  domain: ".onrender.com",
  path: "/",
});

  res.json({ success: true });
});

export default router;
