// import { motion } from "framer-motion";//
// import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown } from "lucide-react";

const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة"];
const TYPES_LIST = ["شقة", "فيلا", "تاون هاوس", "دوبلكس", "مكتب", "أرض"];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir="rtl"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(201,162,39,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(232,131,58,0.08) 0%, transparent 55%), #0e0e16",
        }}
      >
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.1) 0%, transparent 70%)",
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(232,131,58,0.08) 0%, transparent 70%)",
          }}
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Grid lines decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
          style={{
            background: "rgba(201,162,39,0.12)",
            border: "1px solid rgba(201,162,39,0.25)",
            color: "#c9a227",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          المنصة العقارية الأولى في المملكة
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          style={{ color: "#f0ede6" }}
        >
          اكتشف <span className="text-gold-gradient">عقار أحلامك</span>
          <br />
          بكل سهولة وثقة
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-xl mx-auto"
          style={{ color: "#8a8696" }}
        >
          آلاف العقارات المميزة في المملكة العربية السعودية تنتظرك — فلل، شقق،
          مكاتب، وأكثر.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(201,162,39,0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Location */}
          <div
            className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MapPin size={16} style={{ color: "#c9a227" }} />
            <select
              className="bg-transparent text-sm flex-1 outline-none appearance-none cursor-pointer"
              style={{ color: "#f0ede6" }}
            >
              <option value="" style={{ background: "#1a1a2e" }}>
                اختر المدينة
              </option>
              {CITIES.map((c) => (
                <option key={c} value={c} style={{ background: "#1a1a2e" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div
            className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <ChevronDown size={16} style={{ color: "#c9a227" }} />
            <select
              className="bg-transparent text-sm flex-1 outline-none appearance-none cursor-pointer"
              style={{ color: "#f0ede6" }}
            >
              <option value="" style={{ background: "#1a1a2e" }}>
                نوع العقار
              </option>
              {TYPES_LIST.map((t) => (
                <option key={t} value={t} style={{ background: "#1a1a2e" }}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Search btn */}
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 30px rgba(201,162,39,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#c9a227,#e8833a)",
              minWidth: 130,
            }}
          >
            <Search size={17} />
            ابحث الآن
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12"
        >
          {[
            { value: "+١٢٬٠٠٠", label: "عقار مدرج" },
            { value: "+٢٤٠", label: "وكالة موثوقة" },
            { value: "+٥٠٬٠٠٠", label: "عميل سعيد" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-gold-gradient num">
                {s.value}
              </div>
              <div className="text-sm mt-0.5" style={{ color: "#8a8696" }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
