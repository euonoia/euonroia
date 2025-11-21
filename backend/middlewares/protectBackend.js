import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function protectBackend(req, res, next) {
  const token = req.cookies?.euonroiaAuthToken; 
  const origin = req.get("origin") || req.get("referer") || "";

  const allowedOrigins =
    ENV.NODE_ENV === "production"
      ? ["https://euonroia.onrender.com"]
      : ["http://localhost:5173", "http://127.0.0.1:5173"];

  if (req.path.startsWith("/auth/google")) return next();

  if (req.path.startsWith("/api")) {
    if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
      return res.status(403).send("❌ Access forbidden: invalid origin");
    }
  }

  const protectedPaths = ["/api", "/auth/me", "/auth/signout", "/auth/active"];
  const requiresAuth = protectedPaths.some((p) => req.path.startsWith(p));

  if (requiresAuth) {
    if (!token) return res.status(401).json({ error: "Not logged in" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        ...decoded,
        uid: decoded.uid || decoded.id || decoded.sub,
      };

      if (!req.user.uid)
        return res.status(401).json({ error: "Invalid token — no UID found" });

      return next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  next();
}
