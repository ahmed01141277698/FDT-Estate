// إعدادات نظام التحقق بالإيميل — كل القيم قابلة للتعديل من متغيرات البيئة，
// وليها قيم افتراضية آمنة لو المتغير مش موجود.

export const OTP_EXPIRATION_MINUTES = Number(process.env.EMAIL_OTP_EXPIRATION_MINUTES) || 10;
export const OTP_MAX_ATTEMPTS = Number(process.env.EMAIL_OTP_MAX_ATTEMPTS) || 5;
export const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.EMAIL_OTP_RESEND_COOLDOWN_SECONDS) || 60;
export const OTP_MAX_RESENDS = Number(process.env.EMAIL_OTP_MAX_RESENDS) || 5;