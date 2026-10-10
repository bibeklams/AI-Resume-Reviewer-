import * as authService from "../service/auth.service.js";

import type { Request, Response, NextFunction } from "express";
import { env } from "../../../config/env.js";
import createError from "http-errors";
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.register({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const emailVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyEmail(email, otp);
    res.json({
      success: true,
      data: result,
      message: "Email Verified Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json({
      success: true,
      data: result,
      message: "Successfuly forget Password",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyResetOtp(email, otp);
    res.json({
      success: true,
      data: result,
      message: "Successfully Verified ",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    res.json({
      success: true,
      data: result,
      message: "Successfully Reset password",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: env.ACCESS_TOKEN_EXPIRY_SECONDS * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: env.REFRESH_TOKEN_EXPIRY_SECONDS * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.id) {
      await authService.logout(req.user.id);
    }

    const cookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw createError(401, "Refresh token missing");
    }

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw createError(401, "Not authenticated");
    }

    const { password: _password, ...safeUser } = user;

    res.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
