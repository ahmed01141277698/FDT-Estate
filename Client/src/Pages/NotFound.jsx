import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Home, Search, MapPinOff } from "lucide-react";

const NotFound = () => {
  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 text-white"
      style={{ background: "linear-gradient(180deg, #183d37 0%, #0e0e16 60%)" }}
    >
      <div className="pointer-events-none absolute -left-24 top-16 size-96 rounded-full bg-[#c9a227]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-[#e2a87b]/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* الختم — نفس عنصر الهوية بتاع صفحات التسجيل، هنا بمعنى "مفقود" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mx-auto mb-8 flex size-28 items-center justify-center"
        >
          <div className="relative flex size-full items-center justify-center rounded-full border-[3px] border-white/20 bg-white/5 backdrop-blur-sm">
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-1.5 motion-safe:animate-[spin_30s_linear_infinite]"
            >
              <defs>
                <path
                  id="notFoundSealCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="#e8c56d"
                fontSize="9"
                fontWeight="700"
                letterSpacing="2"
              >
                <textPath href="#notFoundSealCircle" startOffset="0%">
                  عقاركس ★ الصفحة غير موجودة ★
                </textPath>
              </text>
            </svg>
            <MapPinOff size={30} className="text-[#e8c56d]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-gold-gradient text-7xl font-black tracking-tight sm:text-8xl"
        >
          <span className="num">404</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="mt-4 text-2xl font-black sm:text-3xl"
        >
          مش لاقيين الصفحة دي
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.4 }}
          className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#a9beb5] sm:text-base"
        >
          يمكن الرابط اتغيّر، أو العقار اللي بتدور عليه مبقاش متاح، أو حصلت غلطة
          إملائية بسيطة في العنوان.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#e49263] px-6 py-3 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/25 transition hover:translate-y-[-1px] hover:bg-[#f1b68b] sm:w-auto"
          >
            <Home size={16} />
            الرئيسية
          </Link>

          <Link
            to="/AllListings"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-extrabold text-white transition hover:border-[#c9a227]/50 hover:bg-white/10 sm:w-auto"
          >
            <Search size={16} />
            تصفّح العقارات
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 flex items-center justify-center gap-2 text-xs font-bold text-[#7f9089]"
        >
          <Building2 size={14} className="text-[#e8c56d]" />
          عقاركس — منصتك العقارية الموثوقة
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
