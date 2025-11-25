import jwt from "jsonwebtoken";
import admin from "firebase-admin";

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.euonroiaAuthToken;
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.uid) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded;

    await admin.firestore()
      .collection("users")
      .doc(decoded.uid)
      .update({
        lastActive: admin.firestore.FieldValue.serverTimestamp(),
      });

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
