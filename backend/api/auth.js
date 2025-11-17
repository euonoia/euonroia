import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

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
    ? "https://euonroia.onrender.com/auth/google/callback"
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

    // Get user info from Google
    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = data;

    // ✅ Check if user exists in Firebase Auth
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

    // Optional: update info if changed
    await admin.auth().updateUser(userRecord.uid, {
      displayName: name,
      photoURL: picture,
    });

    // Ensure Google provider exists in Firebase
    const user = await admin.auth().getUser(userRecord.uid);
    if (!user.providerData.some((p) => p.providerId === "google.com")) {
      await admin.auth().updateUser(userRecord.uid, {
        providerData: [
          ...(user.providerData || []),
          {
            providerId: "google.com",
            displayName: name,
            email,
            photoURL: picture,
            uid: id,
          },
        ],
      });
    }

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

    // Create short-lived session token
    const token = jwt.sign(
      { uid: userRecord.uid, name, email, picture },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    if (!isProduction) console.error("❌ OAuth callback error:", err);
    res.redirect(FRONTEND_URL);
  }
});

// --- 3️⃣ Protected route ---
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const userRecord = await admin.auth().getUser(decoded.uid);

    res.json({
      user: {
        id: userRecord.uid,
        name: userRecord.displayName,
        email: userRecord.email,
        picture: userRecord.photoURL,
      },
    });
  } catch (err) {
    if (!isProduction) console.error("Auth check failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- 4️⃣ Logout ---
router.post("/signout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.json({ success: true });
});

export default router;
