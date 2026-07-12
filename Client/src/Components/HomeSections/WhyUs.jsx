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
    span: "col-span-2 md:col-span-1",
    large: true,
  },
  {
    icon: BadgeCheck,
    title: "قوائم موثقة",
    desc: "جميع العقارات مراجعة ومعتمدة من فريقنا المتخصص.",
    span: "",
    large: false,
  },
  {
    icon: Users,
    title: "وكالات موثوقة",
    desc: "شبكة من الوكالات المرخصة ذات سمعة ممتازة في السوق.",
    span: "",
    large: false,
  },
  {
    icon: Sparkles,
    title: "توصيات ذكية",
    desc: "نظام التوصيات يتعلم تفضيلاتك ويقدم اقتراحات مخصصة.",
    span: "",
    large: false,
  },
  {
    icon: Zap,
    title: "بحث فائق السرعة",
    desc: "نتائج فورية ودقيقة في ثوانٍ عبر آلاف القوائم.",
    span: "",
    large: false,
  },
  {
    icon: ShieldCheck,
    title: "منصة آمنة",
    desc: "بياناتك وعملياتك محمية بأعلى معايير الأمان.",
    span: "",
    large: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function WhyUs() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,131,58,0.07) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
          لماذا FDT Estate
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#f0ede6" }}
        >
          ما يجعلنا <span className="text-gold-gradient">الأفضل</span>
        </h2>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Large hero card */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 lg:row-span-2 rounded-2xl p-8 flex flex-col justify-between min-h-64 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.12), rgba(232,131,58,0.08))",
            border: "1px solid rgba(201,162,39,0.25)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%)",
            }}
          />
          <div>
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain size={30} color="#fff" />
            </motion.div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "#f0ede6" }}
            >
              بحث بالذكاء الاصطناعي
            </h3>
            <p
              className="text-base leading-relaxed"
              style={{ color: "#8a8696" }}
            >
              محرك بحث ذكي يفهم احتياجاتك ويقترح العقارات المثالية بدقة متناهية.
              يتعلم من تفضيلاتك ليقدم تجربة فريدة ومخصصة لك.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <span
              className="text-sm font-semibold px-4 py-2 rounded-full"
              style={{
                background: "linear-gradient(135deg,#c9a227,#e8833a)",
                color: "#fff",
              }}
            >
              قريباً
            </span>
          </div>
        </motion.div>

        {/* Small cards */}
        {REASONS.slice(1).map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div
              key={r.title}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden cursor-default"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,162,39,0.12)",
                backdropFilter: "blur(16px)",
              }}
            >
              <motion.div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
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
                  className="text-base font-bold mb-1"
                  style={{ color: "#f0ede6" }}
                >
                  {r.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8a8696" }}
                >
                  {r.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
