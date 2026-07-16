// import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

function AreaCard({ area, index, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(area)}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-2xl overflow-hidden text-right group"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,162,39,0.12)",
        backdropFilter: "blur(16px)",
      }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <div className="absolute inset-0">
        <motion.img
          src={area.image}
          alt={area.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
      </div>

      <div className="relative p-5 flex flex-col gap-3 min-h-[160px] justify-end">
        <div className="flex items-center gap-2">
          <MapPin size={16} style={{ color: "#c9a227" }} />
          <span className="font-semibold" style={{ color: "#f0ede6" }}>
            {area.name}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "#8a8696" }}>
            <span className="num">{area.count}</span> عقار
          </span>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(201,162,39,0.16)", color: "#e8c56d" }}
          >
            استكشف
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function ExploreByArea({ areas = [], onSelect }) {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 10%, rgba(232,131,58,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="text-center mb-12 relative">
        <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
          استكشف حسب المنطقة
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#f0ede6" }}
        >
          مناطق <span className="text-gold-gradient">مفضلة</span> في مصر
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {areas.map((area, i) => (
          <AreaCard
            key={area.id ?? area.name}
            area={area}
            index={i}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
