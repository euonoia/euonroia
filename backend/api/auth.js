import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import firebase from "firebase-admin";

const router = Router();

// -----------------------------
// Environment setup
// -----------------------------
const isProduction = process.env.NODE_ENV === "production";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const GOOGLE_REDIRECT_URI = isProduction
  ? "https://your-production-url.com/auth/google/callback"
  : "http://localhost:5000/auth/google/callback";

const FRONTEND_URL = isProduction
  ? "https://your-frontend-url.com"
  : "http://localhost:5173";

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// -----------------------------
// 1️⃣ Redirect to Google login
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
// 2️⃣ Handle Google OAuth callback
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

    const { id: googleID, name, email, picture } = data;  // Google ID

    let firebaseUser = null;
    try {
      firebaseUser = await firebase.auth().getUser(googleID);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        firebaseUser = await firebase.auth().createUser({
          uid: googleID,
          email: email,
          displayName: name,
          photoURL: picture,
        });
      }
    }

    const firebaseUID = firebaseUser.uid;

    await admin.firestore().collection("users").doc(firebaseUID).set(
      { id: firebaseUID, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // Generate JWT Token
    const token = jwt.sign(
      { id: firebaseUID, name, email, picture },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set the JWT in HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction,   // only set Secure in production
      sameSite: "Strict",     // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with the cookie set
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect(FRONTEND_URL);
  }
});

// -----------------------------
// 3️⃣ Protected route: /me
// -----------------------------
router.get("/me", (req, res) => {
  const authToken = req.cookies.authToken;  // Access the JWT from cookies
  if (!authToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// -----------------------------
// 4️⃣ Logout route
// -----------------------------
router.post("/signout", (req, res) => {
  // Clear the JWT cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: isProduction,  // Only for production
    sameSite: "Strict",
  });
  res.json({ success: true, message: "Logged out" });
});

export default router;
