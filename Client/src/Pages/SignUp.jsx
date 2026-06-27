// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import OAuth_Googal from "../Components/OAuth_Googal";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [registeredEmail, setRegisteredEmail] = useState("");
//   const [resendCountdown, setResendCountdown] = useState(0);
//   const [resendMessage, setResendMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const validateForm = () => {
//     if (!formData.username || !formData.email || !formData.password) {
//       setError("جميع الحقول مطلوبة");
//       return false;
//     }
//     if (formData.password.length < 6) {
//       setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
//       return false;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       setError("البريد الإلكتروني غير صحيح");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch("/api/auth/signUp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok || data.success === false) {
//         setError(data.message || "فشل إنشاء الحساب");
//         return;
//       }
//       navigate("/signin", {
//         state: {
//           email: formData.email,
//           password: formData.password,
//         },
//       });

//       // setSuccessMessage(
//       //   "تم إنشاء الحساب بنجاح. تم إرسال رسالة تحقق إلى بريدك الإلكتروني.",
//       // );
//       //     setRegisteredEmail(formData.email);
//       //     setResendCountdown(120);
//       //     setResendMessage("يمكنك إعادة الإرسال بعد انتهاء المؤقت.");
//       //     setFormData({ username: "", email: "", password: "" });
//       //     setError(null);
//     } catch (err) {
//       setError(err.message || "حدث خطأ، حاول مرة أخرى");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   if (resendCountdown <= 0) return;

//   //   const timerId = setInterval(() => {
//   //     setResendCountdown((prev) => Math.max(prev - 1, 0));
//   //   }, 1000);

//   //   return () => clearInterval(timerId);
//   // }, [resendCountdown]);

//   // useEffect(() => {
//   //   if (resendCountdown <= 0) return;

//   //   const timerId = setInterval(() => {
//   //     setResendCountdown((prev) => Math.max(prev - 1, 0));
//   //   }, 1000);

//   //   return () => clearInterval(timerId);
//   // }, [resendCountdown]);

//   // useEffect(() => {
//   //   if (resendCountdown === 0 && registeredEmail) {
//   //     setResendMessage("يمكنك الآن إعادة إرسال رسالة التحقق.");
//   //   }
//   // }, [resendCountdown, registeredEmail]);

//   const handleResend = async () => {
//     if (!registeredEmail) return;
//     try {
//       setLoading(true);
//       setError(null);
//       setResendMessage("");
//       const response = await fetch("/api/auth/resend-verification", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: registeredEmail }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "فشل إعادة إرسال رسالة التحقق");
//       }
//       setResendMessage(data.message || "تم إرسال رسالة التحقق مرة أخرى.");
//       setResendCountdown(120);
//     } catch (err) {
//       setError(err.message || "حدث خطأ أثناء محاولة الإرسال");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <section className="rounded-lg p-4 bg-white shadow-xl">
//         <div className="flex items-center justify-center my-3">
//           <div className="xl:mx-auto shadow-lg p-6 xl:w-full xl:max-w-sm 2xl:max-w-md rounded-lg border border-gray-200">
//             <div className="text-center mb-6">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 إنشاء حساب جديد
//               </h2>
//               <p className="text-gray-600 text-sm mt-2">انضم إلينا اليوم</p>
//             </div>

//             <form className="mt-6" onSubmit={handleSubmit}>
//               <div className="space-y-4">
//                 {/* Username */}
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-2">
//                     اسم المستخدم
//                   </label>
//                   <input
//                     placeholder="أدخل اسم المستخدم"
//                     type="text"
//                     id="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-2">
//                     البريد الإلكتروني
//                   </label>
//                   <input
//                     placeholder="أدخل بريدك الإلكتروني"
//                     type="email"
//                     id="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-2">
//                     كلمة المرور
//                   </label>
//                   <input
//                     placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
//                     type="password"
//                     id="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
//                   type="submit"
//                   disabled={loading}
//                 >
//                   {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
//                 </button>

//                 {/* OAuth */}
//                 <div className="relative my-4">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">أو</span>
//                   </div>
//                 </div>

//                 <OAuth_Googal />
//               </div>
//             </form>

//             {/* Error Message */}
//             {error && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
//                 {error}
//               </div>
//             )}
//             {successMessage && (
//               <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
//                 {successMessage}
//               </div>
//             )}
//             {/* {registeredEmail && (
//               <div className="mt-4 rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
//                 <p>
//                   تم إرسال رابط التحقق إلى: <strong>{registeredEmail}</strong>
//                 </p>
//                 <p className="mt-2">{resendMessage}</p>
//                 <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
//                   <button
//                     type="button"
//                     onClick={handleResend}
//                     disabled={resendCountdown > 0 || loading}
//                     className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
//                   >
//                     {resendCountdown > 0
//                       ? `أعد الإرسال بعد ${Math.floor(resendCountdown / 60)}:${String(
//                           resendCountdown % 60,
//                         ).padStart(2, "0")}`
//                       : "إعادة إرسال رابط التحقق"}
//                   </button>
//                 </div>
//               </div>
//             )} */}

//             {/* Sign In Link */}
//             <p className="mt-4 text-center text-gray-600">
//               هل لديك حساب بالفعل؟
//               <Link
//                 to="/signin"
//                 className="text-blue-600 hover:underline font-semibold ml-1"
//               >
//                 تسجيل الدخول
//               </Link>
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth_Googal from "../Components/OAuth_Googal";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(null);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
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
        body: JSON.stringify(formData),
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <section className="rounded-lg p-4 bg-white shadow-xl">
        <div className="flex items-center justify-center my-3">
          <div className="xl:mx-auto shadow-lg p-6 xl:w-full xl:max-w-sm 2xl:max-w-md rounded-lg border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                إنشاء حساب جديد
              </h2>
              <p className="text-gray-600 text-sm mt-2">انضم إلينا اليوم</p>
            </div>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="text-sm font-semibold text-gray-700 block mb-2"
                  >
                    اسم المستخدم
                  </label>
                  <input
                    placeholder="أدخل اسم المستخدم"
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 block mb-2"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    placeholder="أدخل بريدك الإلكتروني"
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 block mb-2"
                  >
                    كلمة المرور
                  </label>
                  <input
                    placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-right">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">أو</span>
                  </div>
                </div>

                <OAuth_Googal />
              </div>
            </form>

            {/* Sign In Link */}
            <p className="mt-4 text-center text-gray-600">
              هل لديك حساب بالفعل؟{" "}
              <Link
                to="/signin"
                className="text-blue-600 hover:underline font-semibold"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
