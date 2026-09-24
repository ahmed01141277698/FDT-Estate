import express from "express";
const router = express.Router();

import { signUp, signIn, google } from "../Controls/auth_controll.js";
import {
  verifyEmail,
  resendVerification,
} from "../Controls/verificationController.js";
import {
  forgotPassword,
  resetPassword,
} from "../Controls/passwordResetController.js";
import { simpleRateLimiter } from "../Middleware/simpleRateLimiter.js";

router.post(
  "/signUp",
  simpleRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "محاولات تسجيل كتير، حاول بعد شوية",
  }),
  signUp,
);

router.post(
  "/signIn",
  simpleRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "محاولات دخول كتير، حاول بعد شوية",
  }),
  signIn,
);

router.post("/google", google);

router.post(
  "/verify-email",
  simpleRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "محاولات تحقق كتير، حاول بعد شوية",
  }),
  verifyEmail,
);

router.post(
  "/resend-verification",
  simpleRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: "محاولات إعادة إرسال كتير، حاول بعد شوية",
  }),
  resendVerification,
);

// forgot-password بيغطي كمان إعادة الإرسال (نفس الـ endpoint، الفرونت إند
// بينادي عليه تاني بعد الـ cooldown).
router.post(
  "/forgot-password",
  simpleRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 8,
    message: "محاولات كتير، حاول بعد شوية",
  }),
  forgotPassword,
);

router.post(
  "/reset-password",
  simpleRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "محاولات كتير، حاول بعد شوية",
  }),
  resetPassword,
);

export default router;
