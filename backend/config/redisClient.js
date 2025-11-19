
import Redis from "ioredis";
import { ENV } from "./env.js";

const redisClient = new Redis(ENV.REDIS_URL);

redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;