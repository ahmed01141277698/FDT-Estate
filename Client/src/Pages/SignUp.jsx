import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import OAuth_Googal from "../Components/OAuth_Googal";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      setError("جميع الحقول مطلوبة");
      return false;
    }
    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("البريد الإلكتروني غير صحيح");
      return false;
    }
    if (!/^01[0125][0-9]{8}$/.test(formData.phone.trim())) {
      setError("رقم الهاتف غير صحيح، يجب أن يكون رقم مصري صالح");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setError(data.message || "فشل إنشاء الحساب");
        return;
      }

      navigate("/signin", {
        state: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f2622] px-4 py-20"
      dir="rtl"
    >
      {/* Ambient brand backdrop */}
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
        {/* Signature element — the official seal, stamped onto the document */}
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
                  id="signupSealCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="#173d36"
                fontSize="9"
                fontWeight="800"
                letterSpacing="2"
              >
                <textPath href="#signupSealCircle" startOffset="0%">
                  مَسكَن ★ السجل العقاري ★
                </textPath>
              </text>
            </svg>
            <Building2 size={26} strokeWidth={2.5} className="text-[#173d36]" />
          </Link>
        </motion.div>

        {/* Document card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative rounded-[32px] border border-[#c9a227]/20 bg-[#f8f8f3] px-7 pb-8 pt-20 shadow-[0_40px_100px_-28px_rgba(0,0,0,0.55)] sm:px-9"
        >
          {/* Certificate corner marks */}
          <span className="pointer-events-none absolute right-5 top-5 size-4 border-r-2 border-t-2 border-[#c9a227]/50" />
          <span className="pointer-events-none absolute left-5 top-5 size-4 border-l-2 border-t-2 border-[#c9a227]/50" />
          <span className="pointer-events-none absolute bottom-5 right-5 size-4 border-b-2 border-r-2 border-[#c9a227]/50" />
          <span className="pointer-events-none absolute bottom-5 left-5 size-4 border-b-2 border-l-2 border-[#c9a227]/50" />

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a08a5f]">
              انضم إلينا
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#183d37] sm:text-[26px]">
              أنشئ سجلّك العقاري
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6b7d76]">
              بيانات دقيقة تسهّل التحقق من هويتك وتأمين حسابك
            </p>
          </div>

          <form className="mt-9 space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
              >
                اسم المستخدم
              </label>
              <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                <User size={16} className="shrink-0 text-[#b3a483]" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="أدخل اسم المستخدم"
                  disabled={loading}
                  className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  disabled={loading}
                  className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
              >
                رقم الهاتف
              </label>
              <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                <Phone size={16} className="shrink-0 text-[#b3a483]" />
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  disabled={loading}
                  className="w-full bg-transparent text-left text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
              >
                كلمة المرور
              </label>
              <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                <Lock size={16} className="shrink-0 text-[#b3a483]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6 أحرف على الأقل"
                  disabled={loading}
                  className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#b8b199]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  className="shrink-0 text-[#b3a483] transition hover:text-[#183d37]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
              {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </form>

          <div className="mt-7 flex items-center gap-3 text-center text-xs font-bold text-[#b3a483]">
            <span className="h-px flex-1 bg-[#e2ddd0]" />
            <span>أو</span>
            <span className="h-px flex-1 bg-[#e2ddd0]" />
          </div>

          <div className="mt-6">
            <OAuth_Googal />
          </div>

          <p className="mt-7 text-center text-sm font-semibold text-[#6b7d76]">
            هل لديك حساب بالفعل؟{" "}
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
          بياناتك محمية داخل سجلّنا الموثّق
        </div>
      </div>
    </div>
  );
};

export default SignUp;
