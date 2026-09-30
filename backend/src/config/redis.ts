import { env } from "../config/env.js";
import { Redis } from "ioredis";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
