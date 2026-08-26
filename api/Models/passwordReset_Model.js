import mongoose from "mongoose";

// كولكشن منفصل تمامًا عن EmailVerification — عمدًا، عشان محدش يتعارض مع
// التاني (لو حد بيستخدم OTP عشان يوثّق إيميله في نفس اللحظة اللي بيحاول
// فيها يستعيد باسورده، الاتنين لازم يفضلوا مستقلين).
const PasswordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    resendCount: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// TTL دفاعي — مش الاعتماد الوحيد على الأمان، الكنترولر بيتحقق من
// expiresAt بنفسه كمان بشكل صريح.
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);
export default PasswordReset;
