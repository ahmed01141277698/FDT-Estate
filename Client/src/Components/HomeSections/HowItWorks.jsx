// import { motion } from "framer-motion";
import { Search, MapPin, KeyRound } from "lucide-react";

const STEPS = [
  {
    n: "١",
    title: "ابحث",
    desc: "اختر المدينة ونوع العقار وخلّ البحث الذكي يقترح أفضل الخيارات لك.",
    icon: Search,
  },
  {
    n: "٢",
    title: "استكشف",
    desc: "تصفح العقارات بعناية مع بطاقات موثقة وتفاصيل واضحة وصور عالية الجودة.",
    icon: MapPin,
  },
  {
    n: "٣",
    title: "امتلك",
    desc: "تواصل مع وكيل موثوق وابدأ رحلة التملك بثقة ووضوح.",
    icon: KeyRound,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 30%, rgba(201,162,39,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="text-center mb-12 relative">
        <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
          كيف تعمل المنصة
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#f0ede6" }}
        >
          رحلة <span className="text-gold-gradient">بسيطة</span> من البداية
        </h2>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div
          className="hidden md:block absolute top-1/2 right-0 left-0 h-px"
          style={{ background: "rgba(201,162,39,0.25)" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,162,39,0.12)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#c9a227,#e8833a)",
                    }}
                  >
                    <Icon size={22} style={{ color: "#fff" }} />
                  </div>
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(201,162,39,0.16)",
                      color: "#e8c56d",
                    }}
                  >
                    الخطوة {s.n}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#f0ede6" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8a8696" }}
                >
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
