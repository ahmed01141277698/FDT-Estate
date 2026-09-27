import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      url: {
        type: String,
        default: "رابط الصورة الافتراضية",
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
      website: String,
    },
    notificationPreferences: {
      message: { type: Boolean, default: true }, // فيه حد مهتم بعقارك
      listing_liked: { type: Boolean, default: true }, // حفظ في المفضلة
      price_change: { type: Boolean, default: true }, // تغييرات الأسعار
      listing_approved: { type: Boolean, default: true }, // تأكيد نشر العقار
      system: { type: Boolean, default: true }, // إشعارات عامة من النظام
      verification: { type: Boolean, default: true }, // إشعارات التحقق من الحساب
      password_change: { type: Boolean, default: true }, // تغييرات الباسورد
      new_device_login: { type: Boolean, default: true }, // تسجيل دخول من جهاز جديد
      system_announcement: { type: Boolean, default: true }, // إعلانات عامة من النظام
      account_suspension: { type: Boolean, default: true }, // تعليق الحساب
      avatar_change: { type: Boolean, default: true }, // تغييرات الصورة الشخصية
      listing_deleted: { type: Boolean, default: true }, // حذف العقار
      listing_view: { type: Boolean, default: true }, // مشاهدة العقار
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    accountType: {
      type: String,
      enum: ["individual", "broker", "company", "marketing_office"],
      // individual        = فرد بيبيع/يأجّر عقاره الشخصي
      // broker            = سمسار / وسيط عقاري مستقل
      // company           = شركة عقارية
      // marketing_office  = مكتب تسويق عقاري
      default: "individual",
    },

    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      default: "free",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
