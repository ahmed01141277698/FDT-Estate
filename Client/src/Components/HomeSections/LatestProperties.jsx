import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";

export default function LatestProperties({ properties = [], loading = false }) {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(201,162,39,0.06) 0%, transparent 60%)",
        }}
      />

      <div
        className="flex items-end justify-between mb-10 relative gap-6"
        dir="rtl"
      >
        <div className="text-right">
          <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
            أحدث الإضافات
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ color: "#f0ede6" }}
          >
            أحدث <span className="text-gold-gradient">العقارات</span>
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.05)", height: 420 }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p, i) => (
            <motion.div
              key={p.id ?? i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
            >
              <PropertyCard property={p} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
