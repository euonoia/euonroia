import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function protectBackend(req, res, next) {
  const token = req.cookies?.authToken;
  const origin = req.get("origin") || req.get("referer") || "";

  const allowedOrigins =
    ENV.NODE_ENV === "production"
      ? ["https://euonroia.onrender.com"]
      : ["http://localhost:5173", "http://127.0.0.1:5173"];

  // --- 1️⃣ Allow Google OAuth login & callback without JWT
  if (
    req.path.startsWith("/auth/google") ||
    req.path.startsWith("/auth/google/callback")
  ) {
    return next();
  }

  // --- 2️⃣ Protect API endpoints ---
  if (req.path.startsWith("/api")) {
    // Block requests from unauthorized origins
    if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
      return res.status(403).send("❌ Access forbidden: invalid origin");
    }

    // Require JWT
    if (!token) return res.status(401).json({ error: "Not logged in" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach payload to req.user
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // --- 3️⃣ Protect sensitive /auth/me endpoint ---
  if (req.path.startsWith("/auth/me")) {
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // --- 4️⃣ Protect sensitive /auth/signout endpoint ---
  if (req.path.startsWith("/auth/signout")) {
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // --- 5️⃣ All other routes are safe ---
  next();
}
