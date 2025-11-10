import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

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

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const { data } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const { id, name, email, picture } = data;

    await admin.firestore().collection("users").doc(id).set(
      { id, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    const token = jwt.sign({ id, name, email, picture }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,           // must be true for HTTPS
      sameSite: "None",       // cross-site cookie allowed
      domain: ".onrender.com", // <— this is key!
      path: "/",              // applies globally
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error(err);
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
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });
  res.json({ success: true });
});

export default router;
