import mongoose from "mongoose";

// سجل واحد فعّال لكل يوزر — بيتحدّث في مكانه (upsert) عند كل إرسال أو
// إعادة إرسال، بدل ما نراكم سجلات قديمة. بيتمسح فورًا بعد نجاح التحقق.
const EmailVerificationSchema = new mongoose.Schema(
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

// TTL index: MongoDB بيمسح السجل تلقائيًا لما expiresAt يوصل — دفاع إضافي
// حتى لو حصل أي خطأ في تنظيف السجلات يدويًا في الكود.
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailVerification = mongoose.model("EmailVerification", EmailVerificationSchema);
export default EmailVerification;