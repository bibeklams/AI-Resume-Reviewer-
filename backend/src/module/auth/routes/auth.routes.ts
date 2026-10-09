import express from "express";

import { register, login } from "../controller/auth.controller.js";
import { validation } from "../../../middleware/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";

const router = express.Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", validation(loginSchema), login);
export default router;
