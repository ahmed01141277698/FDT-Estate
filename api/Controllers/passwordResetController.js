import bcrypt from "bcryptjs";
import User from "../Models/user_Model.js";
import PasswordReset from "../Models/passwordReset_Model.js";
import { errorHandler } from "../utils/errors.js";
import { generateOtp, hashOtp, verifyOtpHash } from "../Services/otpService.js";
import {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "../Services/emailService.js";
import { createNotification } from "./notificationController.js";
import { NOTIFICATION_TYPES } from "../Constants/notificationTypes.js";
import {
  PASSWORD_RESET_EXPIRATION_MINUTES,
  PASSWORD_RESET_MAX_ATTEMPTS,
  PASSWORD_RESET_RESEND_COOLDOWN_SECONDS,
  PASSWORD_RESET_MAX_RESENDS,
  PASSWORD_MIN_LENGTH,
} from "../../config/passwordResetConfig.js";

// this is a generic response to avoid revealing whether the email exists in the system or not, for security reasons.
const GENERIC_RESPONSE = {
  success: true,
  message:
    "إذا كان البريد الإلكتروني مرتبطًا بحساب، فسيتم إرسال تعليمات استعادة كلمة المرور إليه.",
};

async function issueNewPasswordReset(user, { isResend = false } = {}) {
  const existing = await PasswordReset.findOne({ userId: user._id });

  if (isResend && existing) {
    const secondsSinceLastSend =
      (Date.now() - existing.lastSentAt.getTime()) / 1000;

    if (secondsSinceLastSend < PASSWORD_RESET_RESEND_COOLDOWN_SECONDS) {
      const err = new Error("RESEND_COOLDOWN");
      err.code = "RESEND_COOLDOWN";
      err.retryAfterSeconds = Math.ceil(
        PASSWORD_RESET_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend,
      );
      throw err;
    }
    if (existing.resendCount >= PASSWORD_RESET_MAX_RESENDS) {
      const err = new Error("TOO_MANY_REQUESTS");
      err.code = "TOO_MANY_REQUESTS";
      throw err;
    }
  }

  const otp = generateOtp();
  const codeHash = hashOtp(otp);
  const expiresAt = new Date(
    Date.now() + PASSWORD_RESET_EXPIRATION_MINUTES * 60 * 1000,
  );

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
  if (isResend) updateDoc.$inc = { resendCount: 1 };
  else updateDoc.$set.resendCount = 0;

  await PasswordReset.findOneAndUpdate({ userId: user._id }, updateDoc, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  await sendPasswordResetEmail({
    to: user.email,
    username: user.username,
    otp,
    expirationMinutes: PASSWORD_RESET_EXPIRATION_MINUTES,
  });
}

// نفس الـ endpoint بيغطي "أول طلب" و"إعادة إرسال" مع بعض — الفرونت إند
// بيستخدمه في الحالتين، وده بيقلل عدد الـ endpoints من غير ما يقلل الأمان.
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "الإيميل مطلوب"));

    const user = await User.findOne({ email });

    // مفيش حساب، أو حساب جوجل بلا باسورد حقيقي — نرجّع نفس الرد بالظبط
    // من غير ما نبعت أي حاجة، عشان منفتحش ثغرة استكشاف حسابات.
    if (!user || user.authProvider === "google") {
      return res.status(200).json(GENERIC_RESPONSE);
    }

    try {
      const existing = await PasswordReset.findOne({ userId: user._id });
      await issueNewPasswordReset(user, { isResend: Boolean(existing) });
    } catch (err) {
      // حتى لو الـ cooldown/الحد الأقصى اتعدّى، برضو منرجعش رد مختلف —
      // كده منكشفش إن الحساب موجود من نوع الخطأ اللي رجع.
      if (err.code !== "RESEND_COOLDOWN" && err.code !== "TOO_MANY_REQUESTS") {
        console.error("خطأ في إصدار رمز استعادة كلمة المرور:", err.message);
      }
    }

    res.status(200).json(GENERIC_RESPONSE);
  } catch (error) {
    console.error("خطأ في طلب استعادة كلمة المرور:", error.message);
    next(errorHandler(500, "حدث خطأ، من فضلك حاول مرة أخرى"));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword)
      return next(errorHandler(400, "كل الحقول مطلوبة"));

    if (newPassword.length < PASSWORD_MIN_LENGTH)
      return res.status(400).json({
        success: false,
        code: "PASSWORD_WEAK",
        message: `كلمة المرور يجب أن تكون ${PASSWORD_MIN_LENGTH} أحرف على الأقل`,
      });

    const user = await User.findOne({ email });
    if (!user) {
      // نفس رسالة الرمز الخاطئ — منكشفش إن الإيميل مش موجود.
      return res.status(400).json({
        success: false,
        code: "PASSWORD_RESET_CODE_INVALID",
        message: "الرمز غير صحيح أو منتهي الصلاحية",
      });
    }

    const record = await PasswordReset.findOne({ userId: user._id });
    if (!record) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_RESET_CODE_INVALID",
        message: "الرمز غير صحيح أو منتهي الصلاحية",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_RESET_CODE_EXPIRED",
        message: "انتهت صلاحية رمز الاستعادة، اطلب رمزًا جديدًا",
      });
    }

    if (record.attempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        code: "PASSWORD_RESET_ATTEMPTS_EXCEEDED",
        message: "محاولات كتير غير صحيحة، اطلب رمزًا جديدًا",
      });
    }

    const isValid = verifyOtpHash(code, record.codeHash);
    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({
        success: false,
        code: "PASSWORD_RESET_CODE_INVALID",
        message: "الرمز غير صحيح",
      });
    }

    // منع إعادة استخدام نفس الباسورد الحالي.
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_REUSE_NOT_ALLOWED",
        message: "كلمة المرور الجديدة لازم تكون مختلفة عن الحالية",
      });
    }
    // this is the point where the password is actually updated in the database after all validations have passed.
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date(); // بيلغي أي JWT قديم صادر قبل اللحظة دي.
    await user.save();

    // الرمز أحادي الاستخدام — بيتمسح فورًا، مينفعش يتعاد استخدامه حتى لو حاول.
    await PasswordReset.deleteOne({ _id: record._id });

    // إشعار أمني بالإيميل — إجباري، مش هنسيبه يفشل بصمت لو حصل خطأ.
    try {
      await sendPasswordChangedEmail({
        to: user.email,
        username: user.username,
        changedAt: user.passwordChangedAt.toLocaleString("ar-EG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });
    } catch (emailError) {
      console.error(
        "فشل إرسال إيميل إشعار تغيير الباسورد:",
        emailError.message,
      );
    }

    // this is a notification that will be created in the system to inform the user that their password has been changed successfully. It includes a link to the profile page and a unique deduplication key to prevent duplicate notifications.
    await createNotification({
      recipient: user._id,
      type: NOTIFICATION_TYPES.PASSWORD_CHANGE,
      title: "تم تغيير كلمة المرور",
      body: "تم تغيير كلمة مرور حسابك بنجاح.",
      link: "/profile",
      deduplicationKey: `password-changed:${user._id}:${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      code: "PASSWORD_RESET_SUCCESS",
      message: "تم تغيير كلمة المرور بنجاح، يمكنك تسجيل الدخول الآن",
    });
  } catch (error) {
    console.error("خطأ في إعادة تعيين كلمة المرور:", error.message);
    next(errorHandler(500, "حدث خطأ، من فضلك حاول مرة أخرى"));
  }
};
