import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const generateAccessToken = (payload: {
  userId: number;
  role: string;
}) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY_SECONDS,
  });
};
export const generateRefreshToken = (payload: { userId: number }) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY_SECONDS,
  });
};
