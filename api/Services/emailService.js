import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465, // true لـ 465، false للباقي (587 بيستخدم STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function buildVerificationEmailText({ username, otp, expirationMinutes }) {
  return `مرحبًا بك في مَسكَن يا ${username} 👋

لإكمال إنشاء حسابك، استخدم رمز التحقق التالي:

${otp}

هذا الرمز صالح لمدة ${expirationMinutes} دقائق.

إذا لم تطلب إنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
لا تشارك رمز التحقق مع أي شخص.`;
}

function buildVerificationEmailHtml({ username, otp, expirationMinutes }) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>تأكيد بريدك الإلكتروني</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f5f0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e7e2d7;">
          <tr>
            <td style="background-color:#183d37;padding:28px 24px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <span style="display:inline-block;width:36px;height:36px;background-color:#e49263;border-radius:10px;color:#173d36;font-weight:900;font-size:18px;line-height:36px;">م</span>
              </div>
              <div style="color:#ffffff;font-size:20px;font-weight:900;margin-top:10px;">مَسكَن</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;text-align:center;">
              <p style="color:#183d37;font-size:18px;font-weight:800;margin:0 0 8px;">مرحبًا بك في مَسكَن يا ${username} 👋</p>
              <p style="color:#6b7d76;font-size:14px;line-height:1.8;margin:0 0 24px;">
                لإكمال إنشاء حسابك، استخدم رمز التحقق التالي:
              </p>
              <div style="background-color:#f7f5f0;border:2px dashed #c9a227;border-radius:16px;padding:18px;margin:0 0 20px;">
                <span style="font-size:32px;font-weight:900;letter-spacing:8px;color:#183d37;direction:ltr;display:inline-block;">${otp}</span>
              </div>
              <p style="color:#a08a5f;font-size:13px;font-weight:700;margin:0 0 24px;">
                هذا الرمز صالح لمدة ${expirationMinutes} دقائق فقط.
              </p>
              <div style="background-color:#fff8f0;border-radius:12px;padding:14px 16px;text-align:right;">
                <p style="color:#8a7a3f;font-size:12px;line-height:1.8;margin:0;">
                  🔒 لا تشارك رمز التحقق ده مع أي حد، فريق مَسكَن مش هيطلبه منك أبدًا.<br />
                  لو مطلبتش تسجيل الحساب ده، تجاهل الرسالة دي ببساطة.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px;background-color:#faf9f6;text-align:center;border-top:1px solid #e7e2d7;">
              <p style="color:#a9beb5;font-size:11px;margin:0;">© مَسكَن — منصتك العقارية الموثوقة</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail({
  to,
  username,
  otp,
  expirationMinutes,
}) {
  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || "مَسكَن"}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: "تأكيد بريدك الإلكتروني - مسكن",
    text: buildVerificationEmailText({ username, otp, expirationMinutes }),
    html: buildVerificationEmailHtml({ username, otp, expirationMinutes }),
  });
}
