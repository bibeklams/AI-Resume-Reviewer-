import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),

  ACCESS_TOKEN_EXPIRY_SECONDS: z.coerce.number().positive(),
  REFRESH_TOKEN_EXPIRY_SECONDS: z.coerce.number().positive(),

  REDIS_URL: z.string().min(1),
  EMAIL_USER: z.string().min(1),
  EMAIL_PASS: z.string(),
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
