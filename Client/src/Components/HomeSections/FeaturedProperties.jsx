import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PropertyCard from "./PropertyCard";

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: "فيلا فاخرة مع مسبح خاص",
    price: "٤٬٨٠٠٬٠٠٠",
    currency: "ريال",
    location: "الرياض، حي الياسمين",
    beds: 6,
    baths: 5,
    area: "٦٥٠",
    agency: "FDT العقارية",
    image:
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80",
    featured: true,
    verified: true,
  },
  {
    id: 2,
    title: "شقة بانورامية على كورنيش جدة",
    price: "١٬٩٥٠٬٠٠٠",
    currency: "ريال",
    location: "جدة، كورنيش الروضة",
    beds: 3,
    baths: 2,
    area: "٢٤٠",
    agency: "مجموعة الخليج",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    featured: false,
    verified: true,
  },
  {
    id: 3,
    title: "تاون هاوس عصري في مشروع متكامل",
    price: "٢٬٢٠٠٬٠٠٠",
    currency: "ريال",
    location: "الدمام، حي الشاطئ",
    beds: 4,
    baths: 3,
    area: "٣٨٠",
    agency: "دار المستقبل",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
    featured: true,
    verified: false,
  },
  {
    id: 4,
    title: "بنتهاوس حصري بإطلالة المدينة",
    price: "٧٬٥٠٠٬٠٠٠",
    currency: "ريال",
    location: "الرياض، العليا",
    beds: 5,
    baths: 4,
    area: "٨٠٠",
    agency: "FDT العقارية",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: true,
    verified: true,
  },
  {
    id: 5,
    title: "دوبلكس راقٍ في حي هادئ",
    price: "٣٬١٠٠٬٠٠٠",
    currency: "ريال",
    location: "الرياض، المونسية",
    beds: 5,
    baths: 4,
    area: "٤٩٠",
    agency: "شركة الإنجاز",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    featured: false,
    verified: true,
  },
];

export default function FeaturedProperties({
  properties = SAMPLE_PROPERTIES,
  loading = false,
}) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? -360 : 360, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft < -10);
    setCanRight(el.scrollLeft > el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative" dir="rtl">
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,39,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>
            اكتشف المميز
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ color: "#f0ede6" }}
          >
            العقارات <span className="text-gold-gradient">المميزة</span>
          </h2>
        </motion.div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => scroll("right")}
            disabled={!canLeft}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: canLeft
                ? "linear-gradient(135deg,#c9a227,#e8833a)"
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <ChevronRight
              size={18}
              style={{ color: canLeft ? "#fff" : "#8a8696" }}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => scroll("left")}
            disabled={!canRight}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{
              background: canRight
                ? "linear-gradient(135deg,#c9a227,#e8833a)"
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,162,39,0.2)",
            }}
          >
            <ChevronLeft
              size={18}
              style={{ color: canRight ? "#fff" : "#8a8696" }}
            />
          </motion.button>
        </div>
      </div>

      {/* Skeleton loader */}
      {loading ? (
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl flex-shrink-0 animate-pulse"
              style={{
                width: 340,
                height: 380,
                background: "rgba(255,255,255,0.05)",
              }}
            />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((p, i) => (
            <PropertyCard key={p.id ?? i} property={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
