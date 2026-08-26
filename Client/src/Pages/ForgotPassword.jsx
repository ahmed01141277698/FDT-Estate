import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, KeyRound, Mail, ShieldCheck } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("من فضلك أدخل بريدك الإلكتروني");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // الرد دايمًا نفسه (رسالة عامة)، بغض النظر هل الحساب موجود أو لأ —
      // ده مقصود، مش باج.
      await res.json();
      setSent(true);
    } catch (err) {
      setError("تعذّر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

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
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative z-20 mx-auto -mb-14 flex size-24 items-center justify-center sm:size-28"
        >
          <Link
            to="/"
            aria-label="الصفحة الرئيسية"
            className="relative flex size-full items-center justify-center rounded-full border-[3px] border-[#f8f8f3] bg-gradient-to-br from-[#e8c56d] to-[#c9a227] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
          >
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-1.5 motion-safe:animate-[spin_26s_linear_infinite]"
            >
              <defs>
                <path
                  id="forgotSealCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="#173d36"
                fontSize="9"
                fontWeight="800"
                letterSpacing="2"
              >
                <textPath href="#forgotSealCircle" startOffset="0%">
                  مَسكَن ★ استعادة كلمة المرور ★
                </textPath>
              </text>
            </svg>
            <Building2 size={26} strokeWidth={2.5} className="text-[#173d36]" />
          </Link>
        </motion.div>

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

          {!sent ? (
            <>
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#183d37]/8">
                  <KeyRound size={22} className="text-[#183d37]" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a08a5f]">
                  استعادة الحساب
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-[#183d37] sm:text-[26px]">
                  نسيت كلمة المرور؟
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#6b7d76]">
                  أدخل بريدك الإلكتروني وسنرسل لك رمزًا آمنًا لاستعادة حسابك.
                </p>
              </div>

              <form
                className="mt-8 space-y-6"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
                  >
                    البريد الإلكتروني
                  </label>
                  <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                    <Mail size={16} className="shrink-0 text-[#b3a483]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="example@mail.com"
                      disabled={loading}
                      className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e49263] px-4 py-3.5 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/30 transition hover:translate-y-[-1px] hover:bg-[#f1b68b] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#e2ddd0] disabled:text-[#a9beb5] disabled:shadow-none"
                >
                  {loading ? "جاري الإرسال..." : "إرسال رمز الاستعادة"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50">
                <Mail size={26} className="text-emerald-600" />
              </div>
              <h1 className="text-xl font-black text-[#183d37]">
                تحقق من بريدك الإلكتروني
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#6b7d76]">
                إذا كان البريد مرتبطًا بحساب، ستصلك رسالة تحتوي على رمز
                الاستعادة.
              </p>
              <button
                onClick={() =>
                  navigate("/reset-password", {
                    state: { email: email.trim() },
                  })
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#e49263] px-4 py-3.5 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/30 transition hover:translate-y-[-1px] hover:bg-[#f1b68b]"
              >
                عندي الرمز، أكمل
              </button>
            </div>
          )}

          <p className="mt-7 text-center text-sm font-semibold text-[#6b7d76]">
            تذكرت كلمة المرور؟{" "}
            <Link
              to="/signin"
              className="font-extrabold text-[#183d37] underline-offset-4 hover:text-[#e49263]"
            >
              تسجيل الدخول
            </Link>
          </p>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[#7f9089]">
          <ShieldCheck size={14} className="text-[#e8c56d]" />
          لن نكشف أبدًا عن وجود حسابك من عدمه
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
