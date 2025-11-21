import express from "express";
import htmlBasicsRouter from "./html-basics.js";
import cssBasicsRouter from "./cssBasics.js";
import javascriptRouter from "./javascript.js";

const router = express.Router();

// Mount each lesson's quizzes route
router.use("/", htmlBasicsRouter);       
router.use("/", cssBasicsRouter);        
router.use("/", javascriptRouter);     

export default router;
