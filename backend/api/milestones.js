import express from "express";
import admin from "firebase-admin";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// GET /api/milestones/progress
router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      console.error("❌ UID missing in request");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = admin.firestore();

    // Fetch user info
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();

    // Helper to check quiz completion
    const getLessonProgress = async (lessonId) => {
      if (!lessonId || !uid) return 0; // safety check

      const quizDoc = await db
        .collection("lessons")
        .doc(lessonId)
        .collection("quizzes")
        .doc(uid)
        .get();

      return quizDoc.exists && quizDoc.data()?.completed ? 100 : 0;
    };

    // Fetch progress in parallel
    const [htmlBasicsProgress, cssBasicsProgress, javascriptProgress] = await Promise.all([
      getLessonProgress("html-basics"),
      getLessonProgress("css-basics"),
      getLessonProgress("javascript"),
    ]);

    res.json({
      displayName: userData?.displayName || "Guest",
      currentLesson: userData?.currentLesson || "",
      htmlBasicsProgress,
      cssBasicsProgress,
      javascriptProgress,
    });
  } catch (err) {
    console.error("Failed to fetch dashboard progress:", err);
    res.status(500).json({ error: "Failed to fetch dashboard progress" });
  }
});

// GET /api/milestones/streak
router.get("/streak", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const lastActive = userData.lastActive ? userData.lastActive.toDate() : null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let streak = userData.streak || 0;

    if (lastActive) {
      const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const diffDays = (today - last) / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        // Already counted today → streak stays the same
      } else if (diffDays === 1) {
        streak += 1; // consecutive
      } else if (diffDays > 1) {
        streak = 0; // reset
      }
    } else {
      streak = 1; // first ever activity
    }

    // update Firestore
    await userRef.update({
      streak,
      lastActive: now,
    });

    res.json({
      message: "Streak updated",
      streak,
      lastActive: now,
    });
  } catch (err) {
    console.error("Failed to update streak:", err);
    res.status(500).json({ error: "Failed to update streak" });
  }
});

router.post("/daily-login", authMiddleware, async (req, res) => {
  const uid = req.user?.uid;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const userRef = admin.firestore().collection("users").doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

  const user = userSnap.data();

  // Use lastClaimedReward instead of lastLogin
  const lastClaimed = user.lastClaimedReward instanceof admin.firestore.Timestamp
    ? user.lastClaimedReward.toDate()
    : new Date(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  // Already claimed today?
  if (lastClaimed >= today) {
    return res.status(400).json({ 
      error: "Reward already claimed today", 
      streak: user.streak || 0,
      xpEarned: 0,
      lastClaimedReward: lastClaimed.toISOString(),
    });
  }

  // Streak calculation based on lastLogin
  const lastLogin = user.lastLogin instanceof admin.firestore.Timestamp
    ? user.lastLogin.toDate()
    : new Date(0);

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  let newStreak = 1;
  if (
    lastLogin >= yesterday && lastLogin < today
  ) {
    newStreak = (user.streak || 0) + 1;
  }

  const dailyXP = 5 + Math.min(newStreak * 2, 20);

  await userRef.update({
    streak: newStreak,
    lastActive: admin.firestore.FieldValue.serverTimestamp(),
    lastClaimedReward: admin.firestore.FieldValue.serverTimestamp(), // update only when claimed
    xp: (user.xp || 0) + dailyXP,
  });

  res.json({
    streak: newStreak,
    xpEarned: dailyXP,
    lastClaimedReward: new Date().toISOString(),
  });
});


router.get("/xp", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();

    // XP and Level
    const xp = user.xp || 0;
    const level = user.level || Math.floor(xp / 100) + 1; 

    res.json({ xp, level });
  } catch (err) {
    console.error("Failed to fetch user XP:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// --- 6️⃣ Check Daily Login Streak ---
router.post("/streak", authMiddleware, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const userRef = admin.firestore().collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnap.data();
    const lastLogin = userData.lastLogin?.toDate() || null;
    let streak = userData.streak || 0;

    // Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let shouldIncrease = false;
    let shouldReset = false;

    if (!lastLogin) {
      // First login ever → streak starts at 1
      streak = 1;
    } else {
      const last = new Date(lastLogin);
      last.setHours(0, 0, 0, 0);

      const diffInMs = today - last;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays === 0) {
        // Already logged in today → do nothing
      } else if (diffInDays === 1) {
        // Logged in yesterday → streak increases
        streak += 1;
        shouldIncrease = true;
      } else {
        // Missed 1+ days → reset streak
        streak = 1;
        shouldReset = true;
      }
    }

    // Update Firestore
    await userRef.set(
      {
        streak,
        lastLogin: admin.firestore.Timestamp.fromDate(today),
      },
      { merge: true }
    );

    res.json({
      success: true,
      streak,
      increased: shouldIncrease,
      reset: shouldReset,
    });
  } catch (err) {
    console.error("Streak check error:", err);
    res.status(500).json({ error: "Failed to check streak" });
  }
});

export default router;
