import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";

const CODE_LENGTH = 6;
const DEFAULT_RESEND_COOLDOWN = 60;

const VerifyEmail = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = location.state?.email || searchParams.get("email") || "";

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [locked, setLocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef([]);

  // عدّاد الـ cooldown بتاع إعادة الإرسال — بيتحدّث كل ثانية لحد ما يوصل صفر.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(
      () => setCooldown((c) => Math.max(c - 1, 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [cooldown]);

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
  };

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean[clean.length - 1];
      return next;
    });

    if (index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
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
      pasted.split("").forEach((char, i) => {
        next[i] = char;
      });
      return next;
    });
    focusInput(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const code = digits.join("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (code.length !== CODE_LENGTH) {
      setError("اكتب الرمز المكوّن من 6 أرقام كاملاً");
      return;
    }

    try {
      setVerifying(true);
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.code === "VERIFICATION_ATTEMPTS_EXCEEDED") {
        setLocked(true);
        setError(data.message);
        return;
      }

      if (!res.ok || data.success === false) {
        setError(data.message || "الرمز غير صحيح");
        setDigits(Array(CODE_LENGTH).fill(""));
        focusInput(0);
        return;
      }

      setSuccess(data.message || "تم توثيق بريدك الإلكتروني بنجاح");
      setTimeout(() => {
        navigate("/signin", { state: { email } });
      }, 1400);
    } catch (err) {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setError(null);
    setSuccess(null);

    try {
      setResending(true);
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.code === "RESEND_COOLDOWN") {
        setCooldown(data.retryAfterSeconds || DEFAULT_RESEND_COOLDOWN);
        setError(data.message);
        return;
      }

      if (data.code === "TOO_MANY_REQUESTS") {
        setError(data.message);
        return;
      }

      setLocked(false);
      setDigits(Array(CODE_LENGTH).fill(""));
      setSuccess("تم إرسال رمز جديد إلى بريدك الإلكتروني");
      setCooldown(DEFAULT_RESEND_COOLDOWN);
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
            مش لاقيين إيميل نتحقق منه
          </p>
          <p className="mt-2 text-sm text-[#6b7d76]">
            ارجع لصفحة إنشاء الحساب أو تسجيل الدخول وحاول تاني.
          </p>
          <Link
            to="/signup"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#e49263] px-6 py-2.5 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
          >
            إنشاء حساب
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
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* الختم — نفس عنصر التوقيع بتاع صفحات التسجيل */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative z-20 mx-auto -mb-14 flex size-24 items-center justify-center sm:size-28"
        >
          <div className="relative flex size-full items-center justify-center rounded-full border-[3px] border-[#f8f8f3] bg-gradient-to-br from-[#e8c56d] to-[#c9a227] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-1.5 motion-safe:animate-[spin_26s_linear_infinite]"
            >
              <defs>
                <path
                  id="verifySealCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="#173d36"
                fontSize="9"
                fontWeight="800"
                letterSpacing="2"
              >
                <textPath href="#verifySealCircle" startOffset="0%">
                  مَسكَن ★ توثيق البريد الإلكتروني ★
                </textPath>
              </text>
            </svg>
            <Building2 size={26} strokeWidth={2.5} className="text-[#173d36]" />
          </div>
        </motion.div>

        {/* الكارت */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative rounded-[32px] border border-[#c9a227]/20 bg-[#f8f8f3] px-7 pb-8 pt-20 shadow-[0_40px_100px_-28px_rgba(0,0,0,0.55)] sm:px-9"
        >
          <span className="pointer-events-none absolute right-5 top-5 size-4 border-r-2 border-t-2 border-[#c9a227]/50" />
          <span className="pointer-events-none absolute left-5 top-5 size-4 border-l-2 border-t-2 border-[#c9a227]/50" />
          <span className="pointer-events-none absolute bottom-5 right-5 size-4 border-b-2 border-r-2 border-[#c9a227]/50" />
          <span className="pointer-events-none absolute bottom-5 left-5 size-4 border-b-2 border-l-2 border-[#c9a227]/50" />

          <div className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#183d37]/8">
              <MailCheck size={22} className="text-[#183d37]" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a08a5f]">
              خطوة أخيرة
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#183d37] sm:text-[26px]">
              وثّق بريدك الإلكتروني
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6b7d76]">
              بعتنا رمز مكوّن من 6 أرقام إلى
              <br />
              <span className="font-bold text-[#183d37]" dir="ltr">
                {email}
              </span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerify} noValidate>
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
                  disabled={locked || verifying}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-14 w-11 rounded-2xl border-2 border-[#e2ddd0] bg-white text-center text-xl font-black text-[#183d37] outline-none transition focus:border-[#e49263] disabled:opacity-50 sm:w-12"
                />
              ))}
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
              disabled={verifying || locked || code.length !== CODE_LENGTH}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e49263] px-4 py-3.5 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/30 transition hover:translate-y-[-1px] hover:bg-[#f1b68b] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#e2ddd0] disabled:text-[#a9beb5] disabled:shadow-none"
            >
              {verifying ? "جاري التحقق..." : "تأكيد الرمز"}
            </button>
          </form>

          <div className="mt-7 text-center">
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
                : resending
                  ? "جاري الإرسال..."
                  : "لم يصلك الرمز؟ أعد الإرسال"}
            </button>
          </div>

          <p className="mt-7 text-center text-sm font-semibold text-[#6b7d76]">
            غلطت في بياناتك؟{" "}
            <Link
              to="/signup"
              className="font-extrabold text-[#183d37] underline-offset-4 hover:text-[#e49263]"
            >
              ابدأ من جديد
            </Link>
          </p>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[#7f9089]">
          <ShieldCheck size={14} className="text-[#e8c56d]" />
          لا تشارك رمز التحقق مع أي شخص
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
