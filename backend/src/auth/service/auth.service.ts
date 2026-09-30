import bcrypt from "bcrypt";
import * as authRepository from "../repository/auth.repositories.js";
import { env } from "../../config/env.js";
import createError from "http-errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { generateOtp } from "../../utils/generateOtp.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../service/email.service.js";

import redis from "../../config/redis.js";
import jwt from "jsonwebtoken";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await authRepository.findUserByEmail(data.email);

  // User already exists
  if (existingUser && existingUser.deletedAt === null) {
    throw createError(400, "User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  let user;

  if (existingUser && existingUser.deletedAt !== null) {
    user = await authRepository.restoreUser(existingUser.id, {
      name: data.name,
      password: hashedPassword,
    });
  } else {
    user = await authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
  }

  // Remove password before returning user
  const { password, ...safeUser } = user;

  // Generate OTP
  const otp = generateOtp();

  // Hash OTP before storing it in Redis
  const hashOtp = await bcrypt.hash(otp, 10);

  // Store OTP hash for 5 minutes
  await redis.set(`email-verification:${user.id}`, hashOtp, "EX", 300);

  // Send OTP email
  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    otp,
  });

  return safeUser;
};

export const verifyEmail = async (email: string, otp: string) => {
  const user = await authRepository.findActiveUserByEmail(email);

  if (!user) {
    throw createError(400, "No email found");
  }

  if (user.emailVerified) {
    throw createError(400, "Email already verified");
  }

  const otpHash = await redis.get(`email-verification:${user.id}`);

  if (!otpHash) {
    throw createError(400, "OTP expired or not found");
  }

  const isValidOtp = await bcrypt.compare(otp, otpHash);

  if (!isValidOtp) {
    throw createError(400, "Invalid OTP");
  }

  await authRepository.verifyEmail(user.id);

  await redis.del(`email-verification:${user.id}`);

  return "Email verified successfully";
};

export const forgotPassword = async (email: string) => {
  const user = await authRepository.findVerifiedUserByEmail(email);

  if (!user) {
    return "If the account exists, a password reset OTP has been sent";
  }

  const otp = generateOtp();
  const hashOtp = await bcrypt.hash(otp, 10);

  await redis.set(`forgotPassword:${user.id}`, hashOtp, "EX", 300);

  await sendResetPasswordEmail({
    email: user.email,
    name: user.name,
    otp,
  });

  return "If the account exists, a password reset OTP has been sent";
};

export const verifyResetOtp = async (email: string, otp: string) => {
  const user = await authRepository.findVerifiedUserByEmail(email);
  if (!user) {
    throw createError(400, "No User found");
  }
  const otpDoc = await redis.get(`forgotPassword:${user.id}`);
  if (!otpDoc) {
    throw createError(400, "Otp expire");
  }
  const verifyOtp = await bcrypt.compare(otp, otpDoc);
  if (!verifyOtp) {
    throw createError(400, "Invalid Otp");
  }

  await redis.del(`forgotPassword:${user.id}`);

  await redis.set(`resetVerified:${user.id}`, "true", "EX", 600);
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await authRepository.findVerifiedUserByEmail(email);

  if (!user) {
    throw createError(400, "No user found");
  }

  const verifyUser = await redis.get(`resetVerified:${user.id}`);

  if (!verifyUser) {
    throw createError(400, "Please verify OTP first");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await authRepository.updatePassword(user.id, hashedPassword);

  await redis.del(`resetVerified:${user.id}`);
  await redis.del(`refresh:${user.id}`);

  return "Password updated successfully";
};

const DUMMY_HASH = await bcrypt.hash("timing-safe-dummy", 10);

export const login = async (data: { email: string; password: string }) => {
  const user = await authRepository.findVerifiedUserByEmail(data.email);

  const isMatch = await bcrypt.compare(
    data.password,
    user ? user.password : DUMMY_HASH,
  );

  if (!user || !isMatch) {
    throw createError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  // NEW: store this refresh token in Redis so it can later be verified/revoked
  await redis.set(
    `refresh:${user.id}`,
    refreshToken,
    "EX",
    env.REFRESH_TOKEN_EXPIRY_SECONDS,
  );

  const { password, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

export const refreshToken = async (token: string) => {
  if (!token) {
    throw createError(401, "Invalid token");
  }

  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
  } catch {
    throw createError(403, "Invalid or expired token");
  }

  if (!decoded.userId) {
    throw createError(401, "Invalid refresh token");
  }

  const userId = Number(decoded.userId);

  if (Number.isNaN(userId)) {
    throw createError(401, "Invalid refresh token");
  }

  // NEW: check this exact token is still valid (not revoked/logged out)
  const storedToken = await redis.get(`refresh:${userId}`);

  if (!storedToken || storedToken !== token) {
    throw createError(401, "Token has been revoked or is no longer valid");
  }

  // Changed findUnique → findFirst so we can filter deletedAt too
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw createError(401, "User not found");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  return {
    accessToken,
  };
};

export const logout = async (userId: number) => {
  await redis.del(`refresh:${userId}`);
  return "Logged out successfully";
};
