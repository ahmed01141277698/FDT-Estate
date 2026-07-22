import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, MapPin, ArrowUpRight } from "lucide-react";

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
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/listing/market-insights`)
      .then((res) => {
        if (!res.ok) throw new Error("تعذّر تحميل إحصاءات السوق");
        return res.json();
      })
      .then(setInsights)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-20 text-center md:px-8 lg:px-16" dir="rtl">
        <p className="text-sm font-semibold text-[#6b7a74]">
          جاري تحميل إحصاءات السوق...
        </p>
      </section>
    );
  }

  if (error || !insights) {
    return (
      <section className="px-4 py-20 text-center md:px-8 lg:px-16" dir="rtl">
        <p className="text-sm font-semibold text-red-500">
          {error || "تعذّر تحميل البيانات"}
        </p>
      </section>
    );
  }

  const STATS = [
    {
      label: "عقار مدرج",
      value: insights.totalListings,
      suffix: "+",
      prefix: "",
    },
    {
      label: "صفقة ناجحة",
      value: insights.successfulDeals,
      suffix: "+",
      prefix: "",
    },
    {
      label: "وكالة موثوقة",
      value: insights.verifiedAgencies,
      suffix: "",
      prefix: "",
    },
    {
      label: "نمو الطلب",
      value: Math.abs(insights.demandGrowth),
      suffix: "%",
      prefix: insights.demandGrowth >= 0 ? "+" : "-",
    },
  ];

  const maxMonthly = Math.max(...insights.monthlyGrowth.map((m) => m.count), 1);

  return (
    <section
      className="relative px-4 py-20 md:px-8 lg:px-16"
      dir="rtl"
      style={{ background: "#f8f6f2" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(201,162,39,0.08) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-14 text-center"
      >
        <p className="mb-2 text-sm font-bold" style={{ color: "#c9a227" }}>
          إحصاءات السوق
        </p>
        <h2
          className="text-3xl font-black md:text-4xl"
          style={{ color: "#183d37" }}
        >
          رؤى <span className="text-gold-gradient">السوق العقاري</span>
        </h2>
      </motion.div>

      {/* Stats Row */}
      <div className="relative z-10 mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl bg-white p-6 text-center shadow-sm"
            style={{ border: "1px solid rgba(24,61,55,0.08)" }}
          >
            <div className="text-gold-gradient mb-1 text-3xl font-extrabold">
              <AnimatedCounter
                target={s.value}
                suffix={s.suffix}
                prefix={s.prefix}
              />
            </div>
            <div className="text-sm" style={{ color: "#6b7a74" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom grid: chart + cities */}
      <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Monthly growth chart — بيانات حقيقية من createdAt للعقارات */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white p-6 shadow-sm"
          style={{ border: "1px solid rgba(24,61,55,0.08)" }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold" style={{ color: "#183d37" }}>
                نمو السوق
              </h3>
              <p className="text-sm" style={{ color: "#6b7a74" }}>
                آخر ١٢ شهر
              </p>
            </div>
            <span
              className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold"
              style={{
                background:
                  insights.demandGrowth >= 0
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(239,68,68,0.12)",
                color: insights.demandGrowth >= 0 ? "#0d9668" : "#dc2626",
              }}
            >
              <TrendingUp size={14} />
              {insights.demandGrowth >= 0 ? "+" : ""}
              {insights.demandGrowth}٪
            </span>
          </div>

          <div className="flex h-32 items-end gap-2">
            {insights.monthlyGrowth.map((m, i) => (
              <motion.div
                key={m.month + i}
                className="flex-1 rounded-t-md"
                style={{
                  background:
                    i === insights.monthlyGrowth.length - 1
                      ? "linear-gradient(to top,#c9a227,#e8833a)"
                      : "rgba(201,162,39,0.3)",
                }}
                initial={{ height: 0 }}
                whileInView={{
                  height: `${Math.max((m.count / maxMonthly) * 100, 4)}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
          </div>

          <div className="mt-2 flex justify-between">
            {insights.monthlyGrowth.map((m, i) => (
              <span
                key={m.month + i}
                className="flex-1 text-center text-[10px] sm:text-xs"
                style={{ color: "#8a988f" }}
              >
                {m.month}
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
          className="rounded-2xl bg-white p-6 shadow-sm"
          style={{ border: "1px solid rgba(24,61,55,0.08)" }}
        >
          <div className="mb-6 flex items-center gap-2">
            <MapPin size={18} style={{ color: "#c9a227" }} />
            <h3 className="text-lg font-bold" style={{ color: "#183d37" }}>
              المدن الأكثر طلبًا
            </h3>
          </div>

          <div className="space-y-4">
            {insights.topCities.length === 0 && (
              <p className="text-sm" style={{ color: "#6b7a74" }}>
                لا توجد بيانات كافية بعد.
              </p>
            )}

            {insights.topCities.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center justify-between rounded-xl px-4 py-3 transition-all hover:scale-[1.02]"
                style={{
                  background: "#f8f6f2",
                  border: "1px solid rgba(24,61,55,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg,#c9a227,#e8833a)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium" style={{ color: "#183d37" }}>
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm" style={{ color: "#6b7a74" }}>
                    <span className="num">
                      {c.listings.toLocaleString("ar-EG")}
                    </span>{" "}
                    عقار
                  </span>
                  <span
                    className="flex items-center gap-0.5 text-sm font-semibold"
                    style={{ color: c.growth >= 0 ? "#0d9668" : "#dc2626" }}
                  >
                    <ArrowUpRight size={14} />
                    {c.growth >= 0 ? "+" : ""}
                    {c.growth}٪
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
