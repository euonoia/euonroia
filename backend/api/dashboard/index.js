import express from "express";
import progressRouter from "./progress.js";
import streakRouter from "./streak.js";
import dailyLoginRouter from "./dailyLogin.js";
import xpRouter from "./xp.js";

const router = express.Router();

router.use("/", progressRouter);
router.use("/", streakRouter);
router.use("/", dailyLoginRouter);
router.use("/", xpRouter);

export default router;
