// functions/endpoints/levelup.js
import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../../middlewares/auth.js"; // Ensure your auth middleware is ready

const router = express.Router();

/**
 * POST /levelup
 * Body: { xpGained: number }
 */
router.post("/levelup", authMiddleware, async (req, res) => {
    try {
        const { xpGained } = req.body;
        if (!xpGained || xpGained <= 0) {
            return res.status(400).json({ error: "Invalid XP value" });
        }

        const userRecord = req.user; // Set by authMiddleware
        const userRef = admin.firestore().collection("users").doc(userRecord.uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userSnap.data();
        let { xp = 0, level = 1 } = userData;

        xp += xpGained;

        // Level up logic: simple formula, 100 * level required for next level
        let leveledUp = false;
        while (xp >= level * 100) {
            xp -= level * 100;
            level += 1;
            leveledUp = true;
        }

        await userRef.update({ xp, level, lastActive: admin.firestore.Timestamp.now() });

        return res.json({ success: true, xp, level, leveledUp });
    } catch (error) {
        console.error("Error in /levelup:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
