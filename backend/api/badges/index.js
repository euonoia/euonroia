import express from "express";
import check from "./check.js";
import earnedBadges from "./earned.js";

const router = express.Router();

router.use("/check", check);
router.use("/earned", earnedBadges);

export default router;
