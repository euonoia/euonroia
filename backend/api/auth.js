import { Router } from "express";
import admin from "firebase-admin";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = Router();

const isProduction = process.env.NODE_ENV === "production";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";

const GOOGLE_REDIRECT_URI = isProduction
  ? "https://euonroia-secured.onrender.com/auth/google/callback"
  : "http://localhost:5000/auth/google/callback";

const FRONTEND_URL = isProduction
  ? "https://euonroia.onrender.com"
  : "http://localhost:5173";

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// 🔑 Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign(user, JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
};

// 1️⃣ Google Login Redirect
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

// 2️⃣ Google OAuth Callback
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

    await admin.firestore()
      .collection("users")
      .doc(id)
      .set({ id, name, email, picture, lastLogin: new Date() }, { merge: true });

    const userPayload = { id, name, email, picture };
    const { accessToken, refreshToken } = generateTokens(userPayload);

    // ✅ Fix cookies for Render (cross-site)
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "None", // Fix for cross-origin cookies
      domain: isProduction ? ".onrender.com" : undefined, // Ensure cookies work across subdomains in production
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect(`${FRONTEND_URL}/oauth-callback`);
  } catch (err) {
    console.error("OAuth error:", err);
    res.redirect(FRONTEND_URL);
  }
});

// 3️⃣ Get current user
router.get("/me", async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// 4️⃣ Refresh token
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded);

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "None", // Fix here too
      domain: isProduction ? ".onrender.com" : undefined, // Ensure cookies work across subdomains in production
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// 5️⃣ Logout
router.post("/signout", (req, res) => {
  const cookieOptions = { httpOnly: true, secure: isProduction, sameSite: "None", domain: isProduction ? ".onrender.com" : undefined };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.json({ success: true });
});

export default router;
