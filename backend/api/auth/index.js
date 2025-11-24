import { Router } from "express";
import googleRouter from "./google.js";
import meRouter from "./me.js";
import signoutRouter from "./signout.js";
import activeRouter from "./active.js";
import logConsent from "./log-consent.js"

const router = Router();

router.use("/google", googleRouter);
router.use("/me", meRouter);
router.use("/signout", signoutRouter);
router.use("/active", activeRouter);
router.use("/consent", logConsent)

export default router;
