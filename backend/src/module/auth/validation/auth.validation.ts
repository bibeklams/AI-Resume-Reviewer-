import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .refine(
      (email) => email.endsWith("@gmail.com"),
      "Only Gmail addresses are allowed",
    ),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .email({
      error: "Please provide a valid email address",
    })
    .trim()
    .toLowerCase()
    .max(254, {
      error: "Email must not exceed 254 characters",
    }),

  password: z.string().min(1, {
    error: "Password is required",
  }),
});

export const resetPasswordSchema = z.object({
  email: z
    .email({
      error: "Please provide a valid email address",
    })
    .trim()
    .toLowerCase()
    .max(254, {
      error: "Email must not exceed 254 characters",
    }),

  newPassword: z
    .string()
    .min(8, {
      error: "Password must be at least 8 characters",
    })
    .max(128, {
      error: "Password must not exceed 128 characters",
    }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, {
    error: "Current password is required",
  }),

  newPassword: z
    .string()
    .min(8, {
      error: "Password must be at least 8 characters",
    })
    .max(128, {
      error: "Password must not exceed 128 characters",
    }),
});

// Reusable email validation
export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(254, "Email is too long"),
});

// Email verification OTP
export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

// Forgot password
export const forgotPasswordSchema = emailSchema;

// Verify password-reset OTP
export const verifyResetOtpSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),

  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});
