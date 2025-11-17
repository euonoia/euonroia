import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET;

// Frontend URL
const FRONTEND_URL = isProduction
  ? "https://euonroia.onrender.com"
  : "http://localhost:5173";

// Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  isProduction
    ? `${FRONTEND_URL}/auth/google/callback`
    : "http://localhost:5000/auth/google/callback"
);

// --- 1️⃣ Redirect to Google with state ---
router.get("/google", (req, res) => {
  // Generate a random state for CSRF protection
  const state = crypto.randomBytes(16).toString("hex");

  // Save state in a cookie
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: isProduction, // ✅ false locally
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 5 * 60 * 1000, // 5 minutes
  });

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state,
  });

  res.redirect(url);
});

// --- 2️⃣ OAuth callback ---
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies?.oauth_state;

    // Check state
    if (!state || !storedState || state !== storedState) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_oauth_state`);
    }

    // Remove state cookie
    res.clearCookie("oauth_state", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
    });

    if (!code) return res.redirect(FRONTEND_URL);

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = data;

    // ✅ Firebase Auth: create or update user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        displayName: name,
        photoURL: picture,
      });
    }

    await admin.auth().updateUser(userRecord.uid, {
      displayName: name,
      photoURL: picture,
    });

    // Firestore user setup
    const userRef = admin.firestore().collection("users").doc(userRecord.uid);
    const userSnap = await userRef.get();
    const now = new Date().toISOString();

    if (!userSnap.exists) {
      await userRef.set(
        {
          uid: userRecord.uid,
          displayName: name,
          email,
          photoURL: picture,
          createdAt: now,
          xp: 0,
          streak: 0,
          level: 1,
          badges: [],
          currentLesson: "html-basics",
          lastActive: now,
          lastLogin: now,
        },
        { merge: true }
      );
    } else {
      await userRef.set(
        {
          displayName: name,
          email,
          photoURL: picture,
          lastLogin: now,
          lastActive: now,
        },
        { merge: true }
      );
    }

    // ✅ Create short-lived JWT
    const token = jwt.sign(
      { uid: userRecord.uid, name, email, picture },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
    
    const csrfToken = crypto.randomBytes(24).toString("hex");
      res.cookie("csrfToken", csrfToken, {
        httpOnly: false,      // frontend needs to read it
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(`${FRONTEND_URL}?error=login_failed`);
  }
});

// --- 3️⃣ Protected route example ---
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// --- 4️⃣ Logout ---
router.post("/signout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });
  res.json({ success: true });
});

export default router;
