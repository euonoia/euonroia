import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function protectBackend(req, res, next) {
  const token = req.cookies?.authToken;
  const origin = req.get("origin") || req.get("referer") || "";

  const allowedOrigins = ENV.NODE_ENV === "production"
    ? ["https://euonroia.onrender.com"]
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

  // ✅ Block requests not from allowed frontend origins (if origin exists)
  if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
    return res.status(403).send("❌ Access forbidden: invalid origin");
  }

  // ✅ /api endpoints require valid JWT
  if (req.path.startsWith("/api")) {
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try { jwt.verify(token, process.env.JWT_SECRET); return next(); } 
    catch { return res.status(401).json({ error: "Invalid or expired token" }); }
  }

  // ✅ OAuth routes: allow without JWT
  if (req.path.startsWith("/auth/google") || req.path.startsWith("/auth/google/callback")) {
    return next();
  }

  // ✅ Other /auth routes
  if (req.path.startsWith("/auth")) {
    if (token) {
      try { jwt.verify(token, process.env.JWT_SECRET); }
      catch { return res.status(401).json({ error: "Invalid token" }); }
    }
    // If no token, allow request — frontend will handle 401 for unauthenticated user
    return next();
  }

  // ✅ Other routes (e.g., /) are safe
  next();
}
