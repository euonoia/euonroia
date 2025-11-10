import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function protectBackend(req, res, next) {
  const token = req.cookies?.authToken;
  const origin = req.get("origin") || req.get("referer") || "";

  const allowedOrigins = ENV.NODE_ENV === "production"
    ? ["https://euonroia.onrender.com"]
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

  // ✅ Block any request not from allowed frontend origin
  if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
    return res.status(403).send("❌ Access forbidden: invalid origin");
  }

  // ✅ /api endpoints must have a valid JWT
  if (req.path.startsWith("/api")) {
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // ✅ /auth routes: only allow OAuth login flow, block direct access with random JWT
  if (req.path.startsWith("/auth/google") || req.path.startsWith("/auth/google/callback")) {
    return next();
  }

  if (req.path.startsWith("/auth")) {
    // Any other /auth endpoints must have a valid JWT
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  // ✅ Other routes (e.g., /) are safe to proceed
  next();
}
