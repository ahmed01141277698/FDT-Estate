import User from "../Models/user_Model.js";
import EmailVerification from "../Models/emailVerification_Model.js";
import { errorHandler } from "../utils/errors.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../Services/otpService.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { createNotification } from "./notificationController.js";
import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";
import {
  OTP_EXPIRATION_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_MAX_RESENDS,
} from "../../config/otpConfig.js";

// دالة مشتركة بيستخدمها كل من التسجيل وإعادة الإرسال — بتولّد رمز جديد，
// وبتتحقق من الـ cooldown والحد الأقصى لو كانت العملية "resend".
export async function issueNewOtp(user, { isResend = false } = {}) {
  const existing = await EmailVerification.findOne({ userId: user._id });

  if (isResend && existing) {
    const secondsSinceLastSend = (Date.now() - existing.lastSentAt.getTime()) / 1000;

    if (secondsSinceLastSend < OTP_RESEND_COOLDOWN_SECONDS) {
      const err = new Error("RESEND_COOLDOWN");
      err.code = "RESEND_COOLDOWN";
      err.retryAfterSeconds = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend);
      throw err;
    }

    if (existing.resendCount >= OTP_MAX_RESENDS) {
      const err = new Error("TOO_MANY_REQUESTS");
      err.code = "TOO_MANY_REQUESTS";
      throw err;
    }
  }

  const otp = generateOtp();
  const codeHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  const updateDoc = {
    $set: {
      email: user.email,
      codeHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
      usedAt: null,
    },
  };

  if (isResend) {
    updateDoc.$inc = { resendCount: 1 };
  } else {
    updateDoc.$set.resendCount = 0;
  }

  await EmailVerification.findOneAndUpdate({ userId: user._id }, updateDoc, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  await sendVerificationEmail({
    to: user.email,
    username: user.username,
    otp,
    expirationMinutes: OTP_EXPIRATION_MINUTES,
  });
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return next(errorHandler(400, "الإيميل ورمز التحقق مطلوبان"));

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "المستخدم غير موجود"));

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        code: "EMAIL_ALREADY_VERIFIED",
        message: "بريدك الإلكتروني متحقق منه بالفعل",
      });
    }

    const record = await EmailVerification.findOne({ userId: user._id });
    if (!record) {
      return res.status(400).json({
        success: false,
        code: "INVALID_VERIFICATION_CODE",
        message: "لا يوجد رمز تحقق فعّال، من فضلك اطلب رمزًا جديدًا",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        code: "VERIFICATION_CODE_EXPIRED",
        message: "انتهت صلاحية رمز التحقق، اطلب رمزًا جديدًا",
      });
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        code: "VERIFICATION_ATTEMPTS_EXCEEDED",
        message: "محاولات كتير غير صحيحة، اطلب رمزًا جديدًا",
      });
    }

    const isValid = verifyOtpHash(code, record.codeHash);

    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({
        success: false,
        code: "INVALID_VERIFICATION_CODE",
        message: "رمز التحقق غير صحيح",
      });
    }

    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    // رمز التحقق أحادي الاستخدام — بيتمسح فورًا بعد النجاح، مينفعش يتعاد استخدامه.
    await EmailVerification.deleteOne({ _id: record._id });

    // إشعار الترحيب بقى هنا بدل وقت التسجيل الخام، لأن الحساب دلوقتي بس
    // بقى "حقيقي" ومفعّل فعليًا.
    await createNotification({
      recipient: user._id,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: `أهلاً بيك في مَسكَن يا ${user.username}`,
      body: "ابدأ استكشاف العقارات أو أضف أول إعلان ليك دلوقتي",
      link: "/",
      deduplicationKey: `welcome:${user._id}`,
    });

    const { password, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: "تم توثيق بريدك الإلكتروني بنجاح، يمكنك تسجيل الدخول الآن",
      user: rest,
    });
  } catch (error) {
    console.error("خطأ في التحقق من البريد:", error);
    next(errorHandler(500, "حدث خطأ أثناء التحقق من البريد الإلكتروني"));
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "الإيميل مطلوب"));

    const user = await User.findOne({ email });

    // ما بنكشفش هل الحساب موجود أو متحقق منه بالفعل لغير صاحبه — رد موحّد
    // في كل الحالات "الآمنة" عشان محدش يقدر يستكشف حسابات موجودة.
    if (!user || user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "لو الحساب ده موجود ومحتاج توثيق، هيوصله رمز تحقق جديد الآن",
      });
    }

    try {
      await issueNewOtp(user, { isResend: true });
    } catch (err) {
      if (err.code === "RESEND_COOLDOWN") {
        return res.status(429).json({
          success: false,
          code: "RESEND_COOLDOWN",
          message: `من فضلك انتظر ${err.retryAfterSeconds} ثانية قبل طلب رمز جديد`,
          retryAfterSeconds: err.retryAfterSeconds,
        });
      }
      if (err.code === "TOO_MANY_REQUESTS") {
        return res.status(429).json({
          success: false,
          code: "TOO_MANY_REQUESTS",
          message: "وصلت للحد الأقصى من محاولات إعادة الإرسال، تواصل مع الدعم",
        });
      }
      throw err;
    }

    res.status(200).json({ success: true, message: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني" });
  } catch (error) {
    console.error("خطأ في إعادة إرسال رمز التحقق:", error);
    next(errorHandler(500, "حدث خطأ أثناء إعادة إرسال رمز التحقق"));
  }
};