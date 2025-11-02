import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = Router();

// ✅ Environment config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Automatically pick correct redirect URI
const GOOGLE_REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? `${process.env.BACKEND_URL}/auth/google/callback`
    : "http://localhost:5000/auth/google/callback";

// 🔐 Initialize OAuth2 Client
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

//
// 1️⃣ Redirect user to Google login
//
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

//
// 2️⃣ Handle Google callback → issue JWT
//
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error("Missing authorization code");

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const { data: userInfo } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = userInfo;

    // Save to Firestore
    await admin.firestore().collection("users").doc(id).set(
      {
        id,
        name,
        email,
        picture,
        lastLogin: new Date(),
      },
      { merge: true }
    );

    // 🔑 Generate your own JWT
    const token = jwt.sign({ id, name, email, picture }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Redirect user back to frontend
    const redirectUrl = `${FRONTEND_URL}/oauth-callback?token=${token}`;
    console.log(`Redirecting to frontend: ${redirectUrl}`);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.status(500).send("Google OAuth failed");
  }
});

//
// 3️⃣ Protected route (check JWT)
//
router.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});
export default router;
