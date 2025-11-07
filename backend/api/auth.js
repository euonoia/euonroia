import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import firebase from "firebase-admin";  // Ensure Firebase Admin SDK is used

const router = Router();

// -----------------------------
// Environment setup
// -----------------------------
const isProduction = process.env.NODE_ENV === "production";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// Google redirect URI depends on environment
const GOOGLE_REDIRECT_URI = isProduction
  ? "https://euonroia-secured.onrender.com/auth/google/callback"
  : "http://localhost:5000/auth/google/callback";

// Frontend URL depends on environment
const FRONTEND_URL = isProduction
  ? "https://euonroia.onrender.com"
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

    // Get tokens from Google
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id: googleID, name, email, picture } = data;  // Google ID

    // Check if the user exists in Firebase by using the Google ID (googleID)
    let firebaseUser = null;
    try {
      // Get Firebase user by Google ID (using Firebase's auth service)
      firebaseUser = await firebase.auth().getUser(googleID);  // Firebase UID will be returned
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create a Firebase user if it doesn't exist (Firebase UID will be auto-generated)
        firebaseUser = await firebase.auth().createUser({
          uid: googleID,  // Use Google ID for Firebase UID
          email: email,
          displayName: name,
          photoURL: picture,
        });
      }
    }

    // Firebase UID (this is the identifier for your user in Firebase)
    const firebaseUID = firebaseUser.uid;

    // Save user info in Firestore (use Firebase UID)
    await admin.firestore().collection("users").doc(firebaseUID).set(
      { id: firebaseUID, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // Now create JWT for frontend using Firebase UID
    const token = jwt.sign(
      { id: firebaseUID, name, email, picture },  // Use Firebase UID as user identifier
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Set token in a secure, HttpOnly cookie
    res.cookie("authToken", token, {
      httpOnly: true,  // Cookie is not accessible via JavaScript
      secure: true,    // Ensure cookie is only sent over HTTPS (use in production)
      sameSite: "Strict",  // Protect from CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000,  // Expiration time (7 days)
    });

    // Redirect to frontend
    res.redirect(`${FRONTEND_URL}/oauth-callback`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect(FRONTEND_URL);
  }
});

// -----------------------------
// 3️⃣ Protected route: /me
// -----------------------------
router.get("/me", (req, res) => {
  const authHeader = req.cookies.authToken;  // Read JWT from cookies

  if (!authHeader) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);  // Verify JWT
    res.json({ user: decoded });  // Return decoded Firebase UID here
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// -----------------------------
// 4️⃣ Logout route
// -----------------------------
router.post("/signout", (req, res) => {
  res.clearCookie("authToken");  // Clear the cookie on logout
  res.json({ success: true, message: "Logged out" });
});

export default router;
