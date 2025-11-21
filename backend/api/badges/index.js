import express from "express";
import check from "./check.js";
import earnedBadges from "./earnedbadges.js";

const router = express.Router();

router.use("/", check);
router.use("/", earnedBadges);

export default router;
