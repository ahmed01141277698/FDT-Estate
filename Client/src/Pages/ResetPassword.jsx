import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

const CODE_LENGTH = 6;
const DEFAULT_RESEND_COOLDOWN = 60;

function getPasswordStrength(password) {
  if (!password) return { label: "", percent: 0, color: "#e2ddd0" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: "ضعيفة", percent: 33, color: "#dc2626" };
  if (score <= 3) return { label: "متوسطة", percent: 66, color: "#e49263" };
  return { label: "قوية", percent: 100, color: "#16a34a" };
}

const ResetPassword = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = location.state?.email || searchParams.get("email") || "";

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef([]);
  const strength = getPasswordStrength(newPassword);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(
      () => setCooldown((c) => Math.max(c - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [cooldown]);

  const focusInput = (index) => inputsRef.current[index]?.focus();

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean ? clean[clean.length - 1] : "";
      return next;
    });
    if (clean && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      focusInput(index - 1);
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      pasted.split("").forEach((char, i) => (next[i] = char));
      return next;
    });
    focusInput(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const code = digits.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (code.length !== CODE_LENGTH) {
      setError("اكتب الرمز المكوّن من 6 أرقام كاملاً");
      return;
    }
    if (newPassword.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.message || "تعذّر تغيير كلمة المرور");
        return;
      }

      setSuccess(
        "تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
      );
      setTimeout(() => navigate("/signin", { state: { email } }), 1800);
    } catch (err) {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setError(null);
    setSuccess(null);

    try {
      setResending(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      setDigits(Array(CODE_LENGTH).fill(""));
      setCooldown(DEFAULT_RESEND_COOLDOWN);
      setSuccess("لو الحساب موجود، وصله رمز جديد الآن");
      focusInput(0);
    } catch (err) {
      setError("تعذّر إرسال الرمز، حاول مرة أخرى");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#0f2622] px-4"
        dir="rtl"
      >
        <div className="max-w-sm rounded-[28px] border border-[#c9a227]/20 bg-[#f8f8f3] px-7 py-10 text-center shadow-2xl">
          <p className="text-lg font-black text-[#183d37]">
            مش لاقيين إيميل نكمل بيه
          </p>
          <p className="mt-2 text-sm text-[#6b7d76]">
            ارجع لصفحة "نسيت كلمة المرور" وحاول تاني.
          </p>
          <Link
            to="/forgot-password"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#e49263] px-6 py-2.5 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
          >
            نسيت كلمة المرور
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f2622] px-4 py-20"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#183d37] via-[#12302b] to-[#0f2622]" />
      <div className="absolute -left-28 top-1/4 size-[28rem] rounded-full bg-[#e2a87b]/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 size-[24rem] rounded-full bg-[#e8c56d]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative z-20 mx-auto -mb-14 flex size-24 items-center justify-center sm:size-28"
        >
          <div className="relative flex size-full items-center justify-center rounded-full border-[3px] border-[#f8f8f3] bg-gradient-to-br from-[#e8c56d] to-[#c9a227] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]">
            <Building2 size={26} strokeWidth={2.5} className="text-[#173d36]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative rounded-[32px] border border-[#c9a227]/20 bg-[#f8f8f3] px-7 pb-8 pt-20 shadow-[0_40px_100px_-28px_rgba(0,0,0,0.55)] sm:px-9"
        >
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a08a5f]">
              خطوة أخيرة
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#183d37] sm:text-[26px]">
              عيّن كلمة مرور جديدة
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6b7d76]">
              أدخل الرمز اللي وصلك على
              <br />
              <span className="font-bold text-[#183d37]" dir="ltr">
                {email}
              </span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div
              className="flex justify-center gap-2"
              dir="ltr"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={submitting}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-12 w-10 rounded-2xl border-2 border-[#e2ddd0] bg-white text-center text-lg font-black text-[#183d37] outline-none transition focus:border-[#e49263] disabled:opacity-50 sm:w-11"
                />
              ))}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
              >
                كلمة المرور الجديدة
              </label>
              <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                <Lock size={16} className="shrink-0 text-[#b3a483]" />
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل"
                  disabled={submitting}
                  className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="shrink-0 text-[#b3a483] transition hover:text-[#183d37]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {newPassword && (
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e2ddd0]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${strength.percent}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <span
                    className="mt-1 block text-xs font-bold"
                    style={{ color: strength.color }}
                  >
                    قوة كلمة المرور: {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
              >
                تأكيد كلمة المرور
              </label>
              <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                <Lock size={16} className="shrink-0 text-[#b3a483]" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  disabled={submitting}
                  className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || code.length !== CODE_LENGTH}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e49263] px-4 py-3.5 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/30 transition hover:translate-y-[-1px] hover:bg-[#f1b68b] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#e2ddd0] disabled:text-[#a9beb5] disabled:shadow-none"
            >
              {submitting ? "جاري الحفظ..." : "تغيير كلمة المرور"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#183d37] transition hover:text-[#e49263] disabled:cursor-not-allowed disabled:text-[#a9beb5]"
            >
              <RotateCcw
                size={14}
                className={resending ? "animate-spin" : ""}
              />
              {cooldown > 0
                ? `أعد الإرسال بعد ${cooldown} ثانية`
                : "لم يصلك الرمز؟ أعد الإرسال"}
            </button>
          </div>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[#7f9089]">
          <ShieldCheck size={14} className="text-[#e8c56d]" />
          هنبعتلك إشعار أمني على إيميلك بعد أي تغيير
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
