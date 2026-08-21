// import mongoose from 'mongoose';
// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     avatar: {
//   url: {
//     type: String,
//     default: "رابط الصورة الافتراضية"
//   },
//   public_id: {
//     type: String,
//     default: null
//   }
// },
//     isVerified: {
//         type: Boolean,
//         default: false,
//     },
//     verificationToken: {
//         type: String,
//     },
// }, { timestamps: true });
// const User = mongoose.model('User', userSchema);

// export default User;


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        // مش required على مستوى الاسكيما لأن حسابات جوجل مبيرجعش منها رقم
        // تليفون. فورم التسجيل العادي لسه بيطلبه إجباري في auth_controll.js.
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        url: {
            type: String,
            default: "رابط الصورة الافتراضية"
        },
        public_id: {
            type: String,
            default: null
        }
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
}, notificationPreferences: {
        message: { type: Boolean, default: true }, // فيه حد مهتم بعقارك
        listing_liked: { type: Boolean, default: true }, // حفظ في المفضلة
        price_change: { type: Boolean, default: true }, // تغييرات الأسعار
        listing_approved: { type: Boolean, default: true }, // تأكيد نشر العقار
    },
    emailVerifiedAt: {
  type: Date,
  default: null,
    },
    // استبدل حقل accountType القديم (individual/agency) بالنسخة الموسّعة دي:

accountType: {
  type: String,
  enum: ["individual", "broker", "company", "marketing_office"],
  // individual        = فرد بيبيع/يأجّر عقاره الشخصي
  // broker            = سمسار / وسيط عقاري مستقل
  // company           = شركة عقارية
  // marketing_office  = مكتب تسويق عقاري
  default: "individual",
},

// مكان جاهز لنظام الخطط المدفوعة لاحقًا (من غير ما نبنيه دلوقتي) — كل
// أنواع الحسابات غير "individual" غالبًا هتحتاج خطة اشتراك مختلفة السعر.
subscriptionPlan: {
  type: String,
  enum: ["free", "basic", "pro", "enterprise"],
  default: "free",
},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;