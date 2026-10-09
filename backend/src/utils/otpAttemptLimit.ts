import createError from "http-errors";
import redis from "../config/redis.js";

const MAX_ATTEMPTS = 5;
const ATTEMPT_TTL_SECONDS = 300;

export const checkOtpAttemptLimit = async (key: string) => {
  const attempts = Number((await redis.get(key)) ?? 0);

  if (attempts >= MAX_ATTEMPTS) {
    throw createError(429, "Too many incorrect attempts. Request a new OTP.");
  }
};

export const recordFailedOtpAttempt = async (key: string) => {
  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, ATTEMPT_TTL_SECONDS);
  }

  if (attempts >= MAX_ATTEMPTS) {
    throw createError(429, "Too many incorrect attempts. Request a new OTP.");
  }
};
