import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET;

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

// --- 1️⃣ Google Login Redirect ---
router.get("/google", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 5 * 60 * 1000,
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

// --- 2️⃣ OAuth Google Callback ---
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies?.oauth_state;

    if (!state || !storedState || state !== storedState) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_oauth_state`);
    }

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

    const { id, name, email, picture } = data;

    // Get or create user in Firebase Auth
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

    // Firestore user document
    const userRef = admin.firestore().collection("users").doc(userRecord.uid);
    const userSnap = await userRef.get();
    const now = admin.firestore.Timestamp.now();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

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
      const userData = userSnap.data();
      const lastLoginDate = userData.lastLogin?.toDate() || new Date(0);
      const isNewDay = lastLoginDate < today;

      const updates = {
        displayName: name,
        email,
        photoURL: picture,
        lastActive: now, // always update lastActive
      };

      if (isNewDay) updates.lastLogin = now; // update lastLogin only once per day

      await userRef.set(updates, { merge: true });
    }

    // JWT cookie
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

    // CSRF token
    const csrfToken = crypto.randomBytes(24).toString("hex");
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
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

// --- 3️⃣ /me endpoint ---
router.post("/me", authMiddleware, (req, res) => {
  const clientCsrfToken = req.headers["x-csrf-token"];
  const cookieCsrfToken = req.cookies?.csrfToken;

  if (!clientCsrfToken || clientCsrfToken !== cookieCsrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  res.json({ user: req.user });
});

// --- 4️⃣ Logout ---
router.post("/signout", (req, res) => {
  // Clear authentication token
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  // Clear CSRF token
  res.clearCookie("csrfToken", {
    httpOnly: false, // matches how it was set
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  });

  res.json({ success: true });
});


// --- 5️⃣ Update lastActive endpoint (heartbeat) ---
router.post("/active", authMiddleware, async (req, res) => {
  const uid = req.user?.uid;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const userRef = admin.firestore().collection("users").doc(uid);
  await userRef.update({
    lastActive: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ success: true });
});

export default router;
