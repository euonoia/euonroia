import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function protectBackend(req, res, next) {
  const token = req.cookies?.euonroiaAuthToken; 
  const origin = req.get("origin") || req.get("referer") || "";

  /* --- ADD THIS BLOCK HERE --- */
  if (ENV.NODE_ENV !== "production") {
    // If there is no origin (direct hit) or it's local, let it through
    if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
    
    } else {
       return res.status(403).send("❌ Access forbidden: invalid local origin");
    }
  } else {
    /* --- PRODUCTION ORIGIN CHECK --- */
    const allowedOrigins = ["https://euonroia.onrender.com"];
    if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
      return res.status(403).send("❌ Access forbidden: invalid production origin");
    }
  }
  /* ---------------------------- */

  if (req.path.startsWith("/auth/google")) return next();

  const protectedPaths = ["/api", "/auth/me", "/auth/signout", "/auth/active"];
  const requiresAuth = protectedPaths.some((p) => req.path.startsWith(p));

  if (requiresAuth) {
    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || ENV.JWT_SECRET);
      req.user = {
        ...decoded,
        uid: decoded.uid || decoded.id || decoded.sub,
      };

      if (!req.user.uid) return res.status(401).json({ error: "Invalid UID" });

      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  next();
}