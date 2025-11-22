import jwt from "jsonwebtoken";
import admin from "firebase-admin";

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.euonroiaAuthToken;

    // 1️⃣ No token
    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    // 2️⃣ Verify token expiration + signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false, // ✔ ensure expired tokens throw an error
    });

    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Attach user
    req.user = decoded;

    // 3️⃣ Update lastActive safely
    await admin.firestore().collection("users").doc(decoded.uid).update({
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    });

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);

    // 4️⃣ Expired token should always return 401
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
