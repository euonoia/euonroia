import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";

const router = Router();

// 🧩 Load environment variables dynamically
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// 🧱 Initialize Google OAuth2 client
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

// Function to determine frontend URL dynamically
const getFrontendURL = (req) => {
  if (process.env.VITE_FRONTEND_URL) return process.env.VITE_FRONTEND_URL;
  // Detect local vs deployed from request hostname
  const host = req.headers.host;
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:5173";
  } else {
    return "https://euonroia.onrender.com"; // default deployed frontend
  }
};

// Function to determine Google redirect URI dynamically
const getGoogleRedirectURI = (req) => {
  const host = req.headers.host;
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:5000/auth/google/callback";
  } else {
    return "https://euonroia-backend.onrender.com/auth/google/callback";
  }
};

// 1️⃣ Optional verify endpoint
router.post("/verify", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    await admin.firestore().collection("users").doc(uid).set(
      { uid, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    res.json({ user: { uid, name, email, picture } });
  } catch (err) {
    console.error("❌ Error verifying token:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// 2️⃣ Redirect to Google login
router.get("/google", (req, res) => {
  const redirectURI = getGoogleRedirectURI(req);
  const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectURI);

  const url = oauthClient.generateAuthUrl({
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

// 3️⃣ Google callback — fully backend-driven
router.get("/google/callback", async (req, res) => {
  try {
    const redirectURI = getGoogleRedirectURI(req);
    const oauthClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirectURI);

    const { code } = req.query;
    if (!code) throw new Error("Missing authorization code");

    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);

    const response = await oauthClient.request({ url: "https://www.googleapis.com/oauth2/v2/userinfo" });
    const { id, name, email, picture } = response.data;

    // Save/update user in Firestore
    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    // ✅ Store user info directly in HTTP-only cookie
    res.cookie("session", JSON.stringify({ uid: id, name, email, picture }), {
      httpOnly: true,
      secure: !req.hostname.includes("localhost"), // only secure on deployed
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    // Redirect frontend
    const frontendURL = getFrontendURL(req);
    res.redirect(frontendURL);
  } catch (err) {
    console.error("❌ Google OAuth error:", err);
    res.status(500).send("Google OAuth failed");
  }
});

// 4️⃣ Get current logged-in user from HTTP-only cookie
router.get("/me", (req, res) => {
  const cookie = req.cookies.session;
  if (!cookie) return res.status(401).json({ error: "Not logged in" });

  try {
    const user = JSON.parse(cookie); // directly read from cookie
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
});

// 5️⃣ Sign out — clears the session cookie
router.post("/signout", (req, res) => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: !req.hostname.includes("localhost"),
    sameSite: "lax",
  });
  res.json({ success: true });
});

export default router;
