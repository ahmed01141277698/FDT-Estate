import { motion } from "framer-motion";
import {
  Sparkles,
  BadgeCheck,
  Users,
  Brain,
  Zap,
  ShieldCheck,
} from "lucide-react";

const REASONS = [
  {
    icon: Brain,
    title: "بحث بالذكاء الاصطناعي",
    desc: "محرك بحث ذكي يفهم احتياجاتك ويقترح العقارات المثالية بدقة متناهية.",
    badge: "قريباً",
  },
  {
    icon: BadgeCheck,
    title: "قوائم موثقة",
    desc: "جميع العقارات مراجعة ومعتمدة من فريقنا المتخصص.",
  },
  {
    icon: Users,
    title: "وكالات موثوقة",
    desc: "شبكة من الوكالات المرخصة ذات سمعة ممتازة في السوق.",
  },
  {
    icon: Sparkles,
    title: "توصيات ذكية",
    desc: "نظام التوصيات يتعلم تفضيلاتك ويقدم اقتراحات مخصصة.",
  },
  {
    icon: Zap,
    title: "بحث فائق السرعة",
    desc: "نتائج فورية ودقيقة في ثوانٍ عبر آلاف القوائم.",
  },
  {
    icon: ShieldCheck,
    title: "منصة آمنة",
    desc: "بياناتك وعملياتك محمية بأعلى معايير الأمان.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.15 + i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function WhyUs() {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 md:px-8 lg:px-16"
      dir="rtl"
    >
      {/* توهجات خلفية هادئة */}
      <div
        className="pointer-events-none absolute right-1/4 top-10 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,131,58,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center"
        >
          <p className="mb-2 text-sm font-medium" style={{ color: "#c9a227" }}>
            لماذا FDT Estate
          </p>
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: "#f0ede6" }}
          >
            الأساس اللي <span className="text-gold-gradient">بيتك</span> يقوم
            عليه
          </h2>
        </motion.div>

        {/* صورة البيت في المنتصف بإطار دائري */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto mt-10 flex flex-col items-center"
        >
          {/* توهج خلفي نابض خلف الصورة */}
          <motion.div
            className="pointer-events-none absolute top-8 h-56 w-56 rounded-full md:h-64 md:w-64"
            style={{
              background:
                "radial-gradient(circle, rgba(201,162,39,0.25) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div
            className="relative h-52 w-52 shrink-0 rounded-full p-[3px] md:h-60 md:w-60"
            style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
          >
            <div className="h-full w-full overflow-hidden rounded-full ring-4 ring-[#0e0e16]">
              <img
                src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=900&q=80"
                alt="واجهة فيلا عصرية"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* شعار صغير أسفل الصورة */}
          <div className="relative mt-5 flex items-center gap-2">
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: "#c9a227" }}
            />
            <p
              className="text-sm font-bold tracking-wide"
              style={{ color: "#c9a227" }}
            >
              بيتك يبدأ من هنا
            </p>
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: "#c9a227" }}
            />
          </div>

          {/* الجذع النازل */}
          <div
            className="mt-4 h-10 w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgba(201,162,39,0.6), rgba(201,162,39,0.15))",
            }}
          />
        </motion.div>

        {/* الخط الأفقي اللي بيوصل للكروت */}
        <div
          className="mx-auto mt-0 h-px w-full max-w-3xl"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(201,162,39,0.4) 15%, rgba(201,162,39,0.4) 85%, transparent)",
          }}
        />

        {/* الكروت */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="relative flex flex-col gap-3 rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: r.badge
                    ? "1px solid rgba(201,162,39,0.35)"
                    : "1px solid rgba(201,162,39,0.12)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* خط رأسي صغير يوصل الكارت بالخط الأفقي فوق */}
                <span
                  className="absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2"
                  style={{ background: "rgba(201,162,39,0.35)" }}
                />
                <span
                  className="absolute -top-[42px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                  style={{ background: "#c9a227" }}
                />

                {r.badge && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg,#c9a227,#e8833a)",
                    }}
                  >
                    {r.badge}
                  </span>
                )}

                <motion.div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: "rgba(201,162,39,0.15)",
                    border: "1px solid rgba(201,162,39,0.2)",
                  }}
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Icon size={20} style={{ color: "#c9a227" }} />
                </motion.div>

                <div>
                  <h3
                    className="mb-1 text-sm font-bold md:text-base"
                    style={{ color: "#f0ede6" }}
                  >
                    {r.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed md:text-sm"
                    style={{ color: "#8a8696" }}
                  >
                    {r.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
