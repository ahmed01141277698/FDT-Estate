// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// const VerifyEmail = () => {
//   const [message, setMessage] = useState("جاري التحقق من البريد الإلكتروني...");
//   const [error, setError] = useState(null);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = searchParams.get("token");
//     if (!token) {
//       setError("رمز التحقق غير موجود.");
//       return;
//     }

//     const verify = async () => {
//       try {
//         const response = await fetch(
//           `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
//         );
//         const data = await response.json();
//         if (!response.ok) {
//           throw new Error(data.message || "فشل التحقق من البريد الإلكتروني");
//         }
//         setMessage(
//           "تم تأكيد البريد الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.",
//         );
//         setTimeout(() => navigate("/signin"), 2500);
//       } catch (err) {
//         setError(err.message || "حدث خطأ أثناء التحقق");
//       }
//     };

//     verify();
//   }, [navigate, searchParams]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl text-center">
//         {error ? (
//           <>
//             <h1 className="text-2xl font-semibold text-red-600">فشل التحقق</h1>
//             <p className="mt-4 text-gray-700">{error}</p>
//           </>
//         ) : (
//           <>
//             <h1 className="text-2xl font-semibold text-slate-900">
//               جارِ التحقق
//             </h1>
//             <p className="mt-4 text-gray-700">{message}</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
