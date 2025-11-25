import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateCsrfToken } from "../../middlewares/csrfVerify.js";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const FRONTEND_URL = isProduction
  ? "https://euonroia.onrender.com"
  : "http://localhost:5173";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  isProduction
    ? `${FRONTEND_URL}/auth/google/callback`
    : "http://localhost:5000/auth/google/callback"
);

// --- Google Login Redirect ---
router.get("/", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 5 * 60 * 1000,
    path: "/",
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

// --- OAuth Google Callback ---
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies?.oauth_state;

    if (!state || !storedState || state !== storedState) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_oauth_state`);
    }

    // Clear oauth_state cookie
    res.clearCookie("oauth_state", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
    });

    if (!code) return res.redirect(FRONTEND_URL);

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email } = data;

    // Firebase: get or create user
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch {
      userRecord = await admin.auth().createUser({
        email,
        displayName: name,
      });
    }

    await admin.auth().updateUser(userRecord.uid, { displayName: name });

    // Firestore user document
    const userRef = admin.firestore().collection("users").doc(userRecord.uid);
    const userSnap = await userRef.get();
    const now = admin.firestore.Timestamp.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!userSnap.exists) {
      await userRef.set({
        uid: userRecord.uid,
        displayName: name,
        email,
        createdAt: now,
        xp: 0,
        streak: 0,
        level: 1,
        badges: [],
        currentLesson: "html-basics",
        lastActive: now,
        lastLogin: now,
      });
    } else {
      const userData = userSnap.data();
      const lastLoginDate = userData.lastLogin?.toDate() || new Date(0);
      const isNewDay = lastLoginDate < today;

      const updates = {
        displayName: name,
        email,
        lastActive: now,
      };
      if (isNewDay) updates.lastLogin = now;

      await userRef.set(updates, { merge: true });
    }

    // --- JWT token (minimal payload)
    const accessToken = jwt.sign(
      { uid: userRecord.uid },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Optional: refresh token
    const refreshToken = jwt.sign(
      { uid: userRecord.uid },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // --- Set cookies
    res.cookie("euonroiaAuthToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("euonroiaRefreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // CSRF token tied to JWT
    const csrfToken = generateCsrfToken(accessToken);
    res.cookie("euonroiaCsrfToken", csrfToken, {
      httpOnly: false, // frontend JS reads this
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(`${FRONTEND_URL}?error=login_failed`);
  }
});

export default router;
