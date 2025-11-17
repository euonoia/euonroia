import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = decoded; // ✅ always has uid
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
