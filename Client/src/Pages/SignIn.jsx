// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import OAuth_Googal from "../Components/OAuth_Googal";
// import {
//   signInstart,
//   signInSuccess,
//   signInFailure,
// } from "../../redux/user/userSlice";

// const SignIn = () => {
//   const savedEmail = localStorage.getItem("savedEmail") || "";
//   // const [formData, setFormData] = useState({
//   //   email: savedEmail,
//   //   password: "",
//   // });
//   const [localError, setLocalError] = useState("");
//   const { loading, error } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//     if (localError) setLocalError("");
//   };
//   const location = useLocation();
//   const [formData, setFormData] = useState({
//     email: location.state?.email || "",
//     password: location.state?.password || "",
//   });
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email.trim() || !formData.password.trim()) {
//       setLocalError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
//       return;
//     }

//     try {
//       dispatch(signInstart());
//       const response = await fetch("/api/auth/signIn", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         dispatch(signInFailure(data.message || "حدث خطأ أثناء تسجيل الدخول"));
//         return;
//       }

//       dispatch(signInSuccess(data.user));
//       localStorage.setItem("token", data.token); // ← ضيف
//       navigate("/");
//     } catch (err) {
//       dispatch(signInFailure(err.message || "فشل الاتصال بالخادم"));
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
//       dir="rtl"
//     >
//       <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl">
//         <div className="text-center">
//           <p className="text-sm text-gray-500">مرحبا بك في</p>
//           <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
//             FDT<span className="text-yellow-500">Estate</span>
//           </h1>
//           <p className="mt-3 text-sm text-gray-600">
//             سجل دخولك للوصول إلى لوحة التحكم الخاصة بك
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
//           <div className="rounded-3xl shadow-sm ring-1 ring-black/5 divide-y divide-gray-200 overflow-hidden">
//             <div className="px-4 py-5 sm:p-6 space-y-4">
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   البريد الإلكتروني
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="example@mail.com"
//                   disabled={loading}
//                   className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   كلمة المرور
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   disabled={loading}
//                   className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex w-full justify-center rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-gray-400"
//             >
//               {loading ? "جارٍ الدخول..." : "دخول"}
//             </button>
//           </div>
//         </form>

//         <div className="flex items-center gap-3 text-center text-sm text-gray-500">
//           <span className="h-px flex-1 bg-gray-200" />
//           <span>أو</span>
//           <span className="h-px flex-1 bg-gray-200" />
//         </div>

//         <OAuth_Googal />

//         {(localError || error) && (
//           <p
//             className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
//             role="alert"
//           >
//             {localError || error}
//           </p>
//         )}

//         <p className="mt-4 text-center text-sm text-gray-600">
//           ليس لديك حساب؟{" "}
//           <Link
//             to="/signUp"
//             className="font-semibold text-black underline-offset-4 hover:text-yellow-600"
//           >
//             سجل الآن
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import OAuth_Googal from "../Components/OAuth_Googal";
import {
  signInstart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

const SignIn = () => {
  const savedEmail = localStorage.getItem("savedEmail") || "";
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(savedEmail));
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (localError) setLocalError("");
  };
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || savedEmail,
    password: location.state?.password || "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setLocalError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      dispatch(signInstart());
      const response = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(signInFailure(data.message || "حدث خطأ أثناء تسجيل الدخول"));
        return;
      }

      dispatch(signInSuccess(data.user));
      localStorage.setItem("token", data.token); // ← ضيف
      if (rememberMe) {
        localStorage.setItem("savedEmail", formData.email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message || "فشل الاتصال بالخادم"));
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
                  id="signinSealCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="#173d36"
                fontSize="9"
                fontWeight="800"
                letterSpacing="2"
              >
                <textPath href="#signinSealCircle" startOffset="0%">
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
              مرحبًا بعودتك
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#183d37] sm:text-[26px]">
              سجّل دخولك إلى سجلّك العقاري
            </h1>
          </div>

          <form className="mt-9 space-y-6" onSubmit={handleSubmit} noValidate>
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
                  name="email"
                  type="email"
                  autoComplete="email"
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
                htmlFor="password"
                className="mb-2 block text-xs font-black uppercase tracking-wide text-[#a08a5f]"
              >
                كلمة المرور
              </label>
              <div className="flex items-center gap-2.5 border-b-2 border-[#e2ddd0] pb-2.5 transition focus-within:border-[#e49263]">
                <Lock size={16} className="shrink-0 text-[#b3a483]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-[#6b7d76]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-[#e2ddd0] accent-[#e49263]"
              />
              تذكرني
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e49263] px-4 py-3.5 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/30 transition hover:translate-y-[-1px] hover:bg-[#f1b68b] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#e2ddd0] disabled:text-[#a9beb5] disabled:shadow-none"
            >
              {loading ? "جارٍ الدخول..." : "دخول"}
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

          {(localError || error) && (
            <p
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              role="alert"
            >
              {localError || error}
            </p>
          )}

          <p className="mt-7 text-center text-sm font-semibold text-[#6b7d76]">
            ليس لديك حساب؟{" "}
            <Link
              to="/signUp"
              className="font-extrabold text-[#183d37] underline-offset-4 hover:text-[#e49263]"
            >
              سجل الآن
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

export default SignIn;
