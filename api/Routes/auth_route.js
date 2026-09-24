import express from "express";
const router = express.Router();

import { signUp, signIn, google } from "../Controllers/auth_controll.js";
import {
  verifyEmail,
  resendVerification,
} from "../Controllers/verificationController.js";
import {
  forgotPassword,
  resetPassword,
} from "../Controllers/passwordResetController.js";
import { simpleRateLimiter } from "../Middleware/simpleRateLimiter.js";

router.post(
  "/signUp",
  simpleRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "هناك محاولات تسجيل كثيرة ، حاول في وقت لاحق",
  }),
  signUp,
);

router.post(
  "/signIn",
  simpleRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "هناك محاولات دخول كثيرة ، حاول في وقت لاحق",
  }),
  signIn,
);

router.post("/google", google);

router.post(
  "/verify-email",
  simpleRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "هناك محاولات تحقق كثيرة ، حاول في وقت لاحق",
  }),
  verifyEmail,
);

router.post(
  "/resend-verification",
  simpleRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: "هناك محاولات إعادة إرسال كثيرة ، حاول في وقت لاحق",
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
    message: "هناك محاولات كثيرة ، حاول في وقت لاحق",
  }),
  forgotPassword,
);

router.post(
  "/reset-password",
  simpleRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "هناك محاولات كثيرة ، حاول في وقت لاحق",
  }),
  resetPassword,
);

export default router;
