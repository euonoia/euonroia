// backend/middleware/auth.js
import admin from "firebase-admin";

// Middleware to protect API routes
export async function checkAuth(req, res, next) {
  const token = req.cookies.session; // reads cookie
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    console.error(" Invalid session token:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}
