import express from "express";
const router = express.Router();
import { signUp, signIn, google } from "../Controlles/auth_controll.js";
import {
  verifyEmail,
  resendVerification,
} from "../Controlles/verificationController.js";
import { simpleRateLimiter } from "../middleware/simpleRateLimiter.js";
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
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);
// router.post('/resend-verification', resendVerification);
// router.get('/verify-email', verifyEmail);

export default router;
