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

const FROM = `"${process.env.EMAIL_FROM_NAME || "عقاركس"}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`;

function emailShell({ badge, heading, bodyHtml }) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background-color:#f7f5f0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e7e2d7;">
          <tr>
            <td style="background-color:#183d37;padding:28px 24px;text-align:center;">
              <span style="display:inline-block;width:36px;height:36px;background-color:#e49263;border-radius:10px;color:#173d36;font-weight:900;font-size:18px;line-height:36px;">م</span>
              <div style="color:#ffffff;font-size:20px;font-weight:900;margin-top:10px;">عقاركس</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;text-align:center;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px;background-color:#faf9f6;text-align:center;border-top:1px solid #e7e2d7;">
              <p style="color:#a9beb5;font-size:11px;margin:0;">© عقاركس — منصتك العقارية الموثوقة</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildVerificationEmailText({ username, otp, expirationMinutes }) {
  return `مرحبًا بك في عقاركس يا ${username} 👋

لإكمال إنشاء حسابك، استخدم رمز التحقق التالي:

${otp}

هذا الرمز صالح لمدة ${expirationMinutes} دقائق.

إذا لم تطلب إنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
لا تشارك رمز التحقق مع أي شخص.`;
}

function buildVerificationEmailHtml({ username, otp, expirationMinutes }) {
  return emailShell({
    heading: "تأكيد بريدك الإلكتروني",
    bodyHtml: `
      <p style="color:#183d37;font-size:18px;font-weight:800;margin:0 0 8px;">مرحبًا بك في عقاركس يا ${username} 👋</p>
      <p style="color:#6b7d76;font-size:14px;line-height:1.8;margin:0 0 24px;">لإكمال إنشاء حسابك، استخدم رمز التحقق التالي:</p>
      <div style="background-color:#f7f5f0;border:2px dashed #c9a227;border-radius:16px;padding:18px;margin:0 0 20px;">
        <span style="font-size:32px;font-weight:900;letter-spacing:8px;color:#183d37;direction:ltr;display:inline-block;">${otp}</span>
      </div>
      <p style="color:#a08a5f;font-size:13px;font-weight:700;margin:0 0 24px;">هذا الرمز صالح لمدة ${expirationMinutes} دقائق فقط.</p>
      <div style="background-color:#fff8f0;border-radius:12px;padding:14px 16px;text-align:right;">
        <p style="color:#8a7a3f;font-size:12px;line-height:1.8;margin:0;">
          🔒 لا تشارك رمز التحقق مع احد، فريق عقاركس لا يطلبه منك أبدًا.<br />
          اذا لم تطلب تسجيل هذا الحساب ، تجاهل الرسالة هذة ببساطة.
        </p>
      </div>`,
  });
}

export async function sendVerificationEmail({
  to,
  username,
  otp,
  expirationMinutes,
}) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "تأكيد بريدك الإلكتروني - عقاركس",
    text: buildVerificationEmailText({ username, otp, expirationMinutes }),
    html: buildVerificationEmailHtml({ username, otp, expirationMinutes }),
  });
}

// ============ استعادة كلمة المرور ============

function buildPasswordResetText({ username, otp, expirationMinutes }) {
  return `طلب استعادة كلمة المرور - عقاركس

مرحبًا يا ${username}،

استخدم الرمز التالي لاستعادة كلمة مرورك:

${otp}

هذا الرمز صالح لمدة ${expirationMinutes} دقائق.

لو ماطلبتش استعادة كلمة المرور دي، تجاهل الرسالة دي — حسابك آمن ولن يتغير شيء.
لا تشارك هذا الرمز مع أي شخص.`;
}

function buildPasswordResetHtml({ username, otp, expirationMinutes }) {
  return emailShell({
    heading: "طلب استعادة كلمة المرور",
    bodyHtml: `
      <p style="color:#183d37;font-size:18px;font-weight:800;margin:0 0 8px;">طلب استعادة كلمة المرور 🔑</p>
      <p style="color:#6b7d76;font-size:14px;line-height:1.8;margin:0 0 24px;">مرحبًا يا ${username}، استخدم الرمز التالي لتعيين كلمة مرور جديدة:</p>
      <div style="background-color:#f7f5f0;border:2px dashed #c9a227;border-radius:16px;padding:18px;margin:0 0 20px;">
        <span style="font-size:32px;font-weight:900;letter-spacing:8px;color:#183d37;direction:ltr;display:inline-block;">${otp}</span>
      </div>
      <p style="color:#a08a5f;font-size:13px;font-weight:700;margin:0 0 24px;">هذا الرمز صالح لمدة ${expirationMinutes} دقائق فقط.</p>
      <div style="background-color:#fff8f0;border-radius:12px;padding:14px 16px;text-align:right;">
        <p style="color:#8a7a3f;font-size:12px;line-height:1.8;margin:0;">
          🔒 لو ماطلبتش استعادة كلمة المرور دي، تجاهل الرسالة — حسابك آمن.<br />
          لا تشارك هذا الرمز مع أي شخص.
        </p>
      </div>`,
  });
}

export async function sendPasswordResetEmail({
  to,
  username,
  otp,
  expirationMinutes,
}) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "طلب استعادة كلمة المرور - عقاركس",
    text: buildPasswordResetText({ username, otp, expirationMinutes }),
    html: buildPasswordResetHtml({ username, otp, expirationMinutes }),
  });
}

// ============ إشعار أمني بعد نجاح التغيير ============

function buildPasswordChangedText({ username, changedAt }) {
  return `تم تغيير كلمة المرور - عقاركس

مرحبًا يا ${username}，

تم تغيير كلمة مرور حسابك بنجاح في ${changedAt}.

لو ماكنتش أنت اللي عملت الإجراء ده، تواصل مع الدعم فورًا وغيّر بياناتك.`;
}

function buildPasswordChangedHtml({ username, changedAt }) {
  return emailShell({
    heading: "تم تغيير كلمة المرور",
    bodyHtml: `
      <p style="color:#183d37;font-size:18px;font-weight:800;margin:0 0 8px;">تم تغيير كلمة المرور ✅</p>
      <p style="color:#6b7d76;font-size:14px;line-height:1.8;margin:0 0 20px;">مرحبًا يا ${username}، تم تغيير كلمة مرور حسابك بنجاح في:</p>
      <div style="background-color:#f7f5f0;border-radius:12px;padding:14px;margin:0 0 20px;">
        <span style="font-size:14px;font-weight:800;color:#183d37;" dir="ltr">${changedAt}</span>
      </div>
      <div style="background-color:#fdf2f2;border-radius:12px;padding:14px 16px;text-align:right;">
        <p style="color:#b23b3b;font-size:12px;line-height:1.8;margin:0;">
          ⚠️ لو ماكنتش أنت اللي عملت الإجراء ده، تواصل مع الدعم فورًا واتخذ إجراء أمني.
        </p>
      </div>`,
  });
}

export async function sendPasswordChangedEmail({ to, username, changedAt }) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "تم تغيير كلمة المرور الخاصة بحسابك - عقاركس",
    text: buildPasswordChangedText({ username, changedAt }),
    html: buildPasswordChangedHtml({ username, changedAt }),
  });
}
