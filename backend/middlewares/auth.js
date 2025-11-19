import jwt from "jsonwebtoken";
import admin from "firebase-admin";

export async function authMiddleware(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = decoded;

    // ✅ Update lastActive on every request
    await admin.firestore().collection("users").doc(decoded.uid).update({
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    });

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
