
import Redis from "ioredis";
import { ENV } from "./env.js";

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;