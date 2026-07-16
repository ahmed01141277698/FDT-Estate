import { useMemo, useState } from "react";
// import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function FAQItem({ item, open, onToggle }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,162,39,0.12)",
        backdropFilter: "blur(16px)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-right"
        aria-expanded={open}
      >
        <span className="font-semibold" style={{ color: "#f0ede6" }}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <ChevronDown size={18} style={{ color: "#c9a227" }} />
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "#8a8696" }}
        >
          {item.a}
        </p>
      </motion.div>
    </div>
  );
}

export default function FAQ({ items = [] }) {
  const [openId, setOpenId] = useState(items?.[0]?.id ?? null);

  const list = useMemo(() => items || [], [items]);

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(201,162,39,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="text-center mb-12 relative">
        <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
          الأسئلة الشائعة
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#f0ede6" }}
        >
          كل ما تحتاجه قبل أن <span className="text-gold-gradient">تبدأ</span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 relative">
        {list.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            open={item.id === openId}
            onToggle={() =>
              setOpenId((id) => (id === item.id ? null : item.id))
            }
          />
        ))}
      </div>
    </section>
  );
}
