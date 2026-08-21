import { Router } from "express";
import {
  checkOtp,
  getLocation,
  login,
  logout,
  register,
  requestNewCode,
  resetPassword,
} from "../controllers/auth.controller";
import { validate, validateQuery } from "../middleware/validation.middleware";
import {
  loginSchema,
  newOtpSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  locationQuerySchema,
} from "../validations/auth.schemas";
import verifyToken from "@/middleware/verifyToken.middleware";

const authRoutes = Router();

/**
 * @openapi
 * /auth/login
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 */
authRoutes.route("/login").post(validate(loginSchema), login);

/**
 * @openapi
 * /auth/register
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 */
authRoutes.route("/register").post(validate(registerSchema), register);

/**
 * @openapi
 * /auth/check-code
 *   post:
 *     summary: Verify OTP code
 *     tags: [Authentication]
 */
authRoutes.route("/check-code").post(validate(verifyOtpSchema), checkOtp);

/**
 * @openapi
 * /auth/new-code
 *   post:
 *     summary: Request new OTP
 *     tags: [Authentication]
 */
authRoutes.route("/new-code").post(validate(newOtpSchema), requestNewCode);

/**
 * @openapi
 * /auth/location
 *   get:
 *     summary: Get user location
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
authRoutes
  .route("/location")
  .get(validateQuery(locationQuerySchema), getLocation);

/**
 * @openapi
 * /auth/logout
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
authRoutes.route("/logout").post(verifyToken, logout);

/**
 * @openapi
 * /auth/reset-password
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 */
authRoutes
  .route("/reset-password")
  .post(validate(resetPasswordSchema), resetPassword);

export default authRoutes;
