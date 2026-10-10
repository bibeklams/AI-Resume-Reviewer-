import express from "express";

import * as authController from "../controller/auth.controller.js";
import { validation } from "../../../middleware/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  emailSchema,
  verifyResetOtpSchema,
} from "../validation/auth.validation.js";
import protect from "../../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", validation(registerSchema), authController.register);
router.post(
  "/verify-email",
  validation(verifyOtpSchema),
  authController.emailVerify,
);

router.post(
  "/forgot-password",
  validation(emailSchema),
  authController.forgotPassword,
);

router.post(
  "/verify-reset-otp",
  validation(verifyResetOtpSchema),
  authController.verifyResetOtp,
);
router.post("/login", validation(loginSchema), authController.login);
router.patch(
  "/reset-password",
  validation(resetPasswordSchema),
  authController.resetPassword,
);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", protect, authController.logout);
router.get("/profile", protect, authController.profile);
export default router;
