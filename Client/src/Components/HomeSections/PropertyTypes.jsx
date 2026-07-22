import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Building2,
  TreePine,
  Layers,
  Crown,
  Briefcase,
  ShoppingBag,
  LandPlot,
} from "lucide-react";

const TYPES = [
  {
    label: "فيلا",
    icon: Crown,
    image:
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=600&q=80",
  },
  {
    label: "شقة",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  },
  {
    label: "تاون هاوس",
    icon: Home,
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80",
  },
  {
    label: "دوبلكس",
    icon: Layers,
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
  },
  {
    label: "بنتهاوس",
    icon: TreePine,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    label: "مكتب",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
  {
    label: "محل تجاري",
    icon: ShoppingBag,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
  },
  {
    label: "أرض",
    icon: LandPlot,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  },
];

function TypeCard({ item, index, count, loading }) {
  const [ripples, setRipples] = useState([]);
  const Icon = item.icon;

  const handleRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 700);
  };

  return (
    <Link to={`/AllListings?category=${encodeURIComponent(item.label)}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.45,
          delay: index * 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -6 }}
        onClick={handleRipple}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          aspectRatio: "3/4",
          border: "1px solid rgba(201,162,39,0.15)",
        }}
      >
        {/* BG image with zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.label}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,162,39,0.15), rgba(232,131,58,0.1))",
            }}
          />
        </div>

        {/* Ripple */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 200,
              height: 200,
              top: r.y - 100,
              left: r.x - 100,
              background: "rgba(201,162,39,0.25)",
              animation: "ping 0.7s ease-out forwards",
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon size={22} color="#fff" />
          </motion.div>
          <h3 className="text-base font-bold text-white mb-1">{item.label}</h3>
          <p className="text-xs" style={{ color: "#c9a227" }}>
            {loading ? (
              <span className="inline-block h-3 w-8 animate-pulse rounded bg-white/20" />
            ) : (
              <span className="num">
                {(count ?? 0).toLocaleString("ar-EG")}
              </span>
            )}{" "}
            عقار
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function PropertyTypes() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listing/category-counts")
      .then((res) => res.json())
      .then((data) => setCounts(data || {}))
      .catch(() => setCounts({}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(201,162,39,0.05) 0%, transparent 70%)",
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
          تصفح حسب النوع
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#f0ede6" }}
        >
          اختر <span className="text-gold-gradient">نوع العقار</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {TYPES.map((item, i) => (
          <TypeCard
            key={item.label}
            item={item}
            index={i}
            count={counts[item.label]}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}
