import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Phone,
  ShieldCheck,
  Users,
  Clock3,
} from "lucide-react";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "معاينة ميدانية لكل عقار" },
  { icon: Users, label: "تواصل مباشر بدون وسطاء" },
  { icon: Clock3, label: "استشارة مجانية أول مكالمة" },
];

const PHONE_HREF = "tel:+201553007698";

export default function CTA() {
  return (
    <section className="relative overflow-hidden" dir="rtl">
      {/* منحنى انتقالي من الخلفية البيضاء للسيكشن اللي قبله */}
      <div className="absolute inset-x-0 top-0 z-10 -translate-y-[1px]">
        <svg
          viewBox="0 0 1440 110"
          className="h-16 w-full md:h-24"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,45 C1080,105 360,105 0,45 Z"
            fill="#f8f6f2"
          />
        </svg>
      </div>

      <div
        className="relative px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-32 lg:px-16"
        style={{
          background: "linear-gradient(180deg, #183d37 0%, #0e0e16 100%)",
        }}
      >
        {/* صورة خلفية فاخرة — بلمسة الهيرو، الـ blend mode بس من md فما فوق */}
        <div className="absolute inset-0 opacity-[0.12] md:opacity-[0.16] md:mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* توهجات ثابتة على الموبايل، متحركة من md فما فوق */}
        <div
          className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 rounded-full opacity-40 md:hidden"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute -right-20 -top-10 hidden h-80 w-80 rounded-full md:block"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 70%)",
            willChange: "transform, opacity",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-30 md:hidden"
          style={{
            background:
              "radial-gradient(circle, rgba(232,131,58,0.15) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-20 -left-20 hidden h-80 w-80 rounded-full "
          style={{
            background:
              "radial-gradient(circle, rgba(232,131,58,0.15) 0%, transparent 70%)",
            willChange: "transform, opacity",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* ختم دوّار برقم التليفون — امتداد لنفس ختم الهيرو */}
          <div
            aria-hidden="true"
            className="mx-auto mb-6 hidden size-28 items-center justify-center rounded-full border border-[#c9a227]/25 bg-white/5 backdrop-blur-sm motion-safe:animate-[spin_24s_linear_infinite] lg:flex"
          >
            <svg viewBox="0 0 100 100" className="size-[100px]">
              <defs>
                <path
                  id="ctaStampCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fill="#e8c56d"
                fontSize="9"
                fontWeight="700"
                letterSpacing="2"
              >
                <textPath href="#ctaStampCircle" startOffset="0%">
                  اتصل الآن ★ متاحون على مدار الساعة ★
                </textPath>
              </text>
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl lg:hidden"
            style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
          >
            <Sparkles size={28} color="#fff" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-bold"
            style={{ color: "#c9a227" }}
          >
            جاهز تبدأ؟
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 text-3xl font-black leading-tight md:text-5xl"
            style={{ color: "#f0ede6" }}
          >
            بيتك القادم على بعد <br className="hidden sm:block" />
            <span className="text-gold-gradient">خطوة واحدة منك</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mb-10 max-w-lg text-base leading-8 md:text-lg"
            style={{ color: "#a9beb5" }}
          >
            من البحث الذكي لغاية التواصل المباشر مع المالك، كل حاجة مصممة عشان
            توفّر وقتك ومجهودك، وتوصّلك لقرار تطمن له.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/AllListings" className="w-full sm:w-auto">
              <motion.span
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(201,162,39,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold transition-all"
                style={{
                  background: "linear-gradient(135deg,#c9a227,#e8833a)",
                  color: "#fff",
                }}
              >
                استعرض كل العقارات
                <ArrowLeft size={18} />
              </motion.span>
            </Link>

            <a href={PHONE_HREF} className="w-full sm:w-auto">
              <motion.span
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(201,162,39,0.6)",
                }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(201,162,39,0.25)",
                  color: "#f0ede6",
                  backdropFilter: "blur(12px)",
                }}
              >
                <Phone size={18} style={{ color: "#c9a227" }} />
                احجز معاينة الآن
              </motion.span>
            </a>
          </motion.div>

          {/* نقاط ثقة */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8"
          >
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 text-xs font-bold sm:text-sm"
                style={{ color: "#c6d3ce" }}
              >
                <Icon size={16} style={{ color: "#f1b184" }} />
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
