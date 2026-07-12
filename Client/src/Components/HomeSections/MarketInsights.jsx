import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, MapPin, BarChart3, ArrowUpRight } from "lucide-react";

const STATS = [
  { label: "عقار مدرج", value: 12400, suffix: "+", prefix: "" },
  { label: "صفقة ناجحة", value: 3800, suffix: "+", prefix: "" },
  { label: "وكالة موثوقة", value: 240, suffix: "", prefix: "" },
  { label: "نمو الطلب", value: 38, suffix: "%", prefix: "+" },
];

const CITIES = [
  { name: "الرياض", growth: "+٢٢٪", listings: "٤٬٢٠٠" },
  { name: "جدة", growth: "+١٨٪", listings: "٣٬١٠٠" },
  { name: "الدمام", growth: "+١٤٪", listings: "١٬٨٠٠" },
  { name: "مكة المكرمة", growth: "+١١٪", listings: "١٬٢٠٠" },
];

function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="num tabular-nums">
      {prefix}
      {count.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

export default function MarketInsights() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(201,162,39,0.06) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
          إحصاءات السوق
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#f0ede6" }}
        >
          رؤى <span className="text-gold-gradient">السوق العقاري</span>
        </h2>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl p-6 text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(201,162,39,0.15)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="text-3xl font-extrabold mb-1 text-gold-gradient">
              <AnimatedCounter
                target={s.value}
                suffix={s.suffix}
                prefix={s.prefix}
              />
            </div>
            <div className="text-sm" style={{ color: "#8a8696" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom grid: chart placeholder + cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(201,162,39,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg" style={{ color: "#f0ede6" }}>
                نمو السوق
              </h3>
              <p className="text-sm" style={{ color: "#8a8696" }}>
                آخر ١٢ شهر
              </p>
            </div>
            <span
              className="flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
            >
              <TrendingUp size={14} /> +٢٢٪
            </span>
          </div>
          {/* Bar chart visualization */}
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 50, 80, 60, 90, 75, 95, 70, 100, 85, 110].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-md"
                style={{
                  background:
                    i === 11
                      ? "linear-gradient(to top,#c9a227,#e8833a)"
                      : "rgba(201,162,39,0.25)",
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                transformOrigin="bottom"
                animate={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {[
              "يل",
              "فب",
              "مار",
              "أبر",
              "مي",
              "يو",
              "يل",
              "أغ",
              "سب",
              "أك",
              "نو",
              "دي",
            ].map((m) => (
              <span
                key={m}
                className="text-xs flex-1 text-center"
                style={{ color: "#8a8696" }}
              >
                {m}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Trending cities */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(201,162,39,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} style={{ color: "#c9a227" }} />
            <h3 className="font-bold text-lg" style={{ color: "#f0ede6" }}>
              المدن الأكثر طلباً
            </h3>
          </div>

          <div className="space-y-4">
            {CITIES.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center justify-between py-3 px-4 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg,#c9a227,#e8833a)",
                      color: "#fff",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium" style={{ color: "#f0ede6" }}>
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm" style={{ color: "#8a8696" }}>
                    <span className="num">{c.listings}</span> عقار
                  </span>
                  <span
                    className="flex items-center gap-0.5 text-sm font-semibold"
                    style={{ color: "#10b981" }}
                  >
                    <ArrowUpRight size={14} />
                    {c.growth}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-sm" style={{ color: "#8a8696" }}>
              مؤشر الاستثمار
            </span>
            <div className="flex items-center gap-2">
              <div
                className="h-2 rounded-full overflow-hidden w-28"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(to right,#c9a227,#e8833a)",
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "78%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <span className="text-sm font-bold" style={{ color: "#c9a227" }}>
                ٧٨٪
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
