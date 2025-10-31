import { Router } from "express";
import admin from "firebase-admin";

const router = Router();

// 1️⃣ Verify ID token and insert/update Firestore
router.post("/verify", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decoded;

    // Save to Firestore
    await admin.firestore().collection("users").doc(uid).set(
      { uid, name, email, picture, lastLogin: new Date() },
      { merge: true }
    );

    res.json({ user: { uid, name, email, picture } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// 2️⃣ Redirect user to Google OAuth (you can use Firebase client SDK admin flow or standard OAuth URL)
router.get("/google", (req, res) => {
  const html = `
    <html>
      <body>
        <script>
          // This is a placeholder: normally you would handle OAuth flow here
          // For demo, just ask user to paste idToken in localStorage
          const idToken = prompt("Paste your Google ID token here");
          localStorage.setItem("idToken", idToken);
          window.close();
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

export default router;
