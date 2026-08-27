// مصدر واحد لكل أنواع الإشعارات في المشروع. أي حاجة تانية (الموديل，
// الكنترولرات، الفرونت إند) لازم تستورد من هنا بدل ما تكتب الـ string يدويًا，
// عشان أي غلطة إملائية تتكشف وقت التطوير (import error) مش تفشل بصمت وقت التشغيل.

export const NOTIFICATION_TYPES = Object.freeze({
  MESSAGE: "message", // فيه حد مهتم بعقارك (اتصال/واتساب)
  LISTING_LIKED: "listing_liked", // حد حفظ عقارك في المفضلة
  LISTING_VIEW: "listing_view", // احتياطي لمستقبل تجميع المشاهدات
  PRICE_CHANGE: "price_change", // تغيير سعر (تأكيد للمالك أو تنبيه لمتابع)
  LISTING_APPROVED: "listing_approved", // تم نشر العقار بنجاح
  VERIFICATION: "verification", // احتياطي لمستقبل نظام التوثيق
  SYSTEM: "system", // رسائل عامة زي الترحيب
  PASSWORD_CHANGE: "password_change", // تغيير كلمة المرور
  NEW_DEVICE_LOGIN: "new_device_login", // تسجيل دخول من جهاز جديد
  SYSTEM_ANNOUNCEMENT: "system_announcement", // إعلان عام من النظام
  ACCOUNT_SUSPENSION: "account_suspension", // تعليق الحساب
  AVATAR_CHANGE: "avatar_change", // تغيير صورة الملف الشخصي
});

// نفس القيم كمصفوفة — تُستخدم مباشرة في enum بتاع الموديل.
export const NOTIFICATION_TYPE_VALUES = Object.values(NOTIFICATION_TYPES);
