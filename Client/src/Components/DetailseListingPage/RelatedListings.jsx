import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BedDouble, Bath, MapPin, Loader2 } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("ar-EG");

function RelatedCard({ item, index }) {
  const image =
    item.imageUrl?.[0]?.url || "https://placehold.co/600x400?text=No+Image";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="min-w-[260px] shrink-0 overflow-hidden rounded-2xl border border-[#e7e2d7] bg-white shadow-sm transition-shadow hover:shadow-lg md:min-w-[280px]"
    >
      <Link to={`/listing/${item._id}`}>
        <div className="h-40 overflow-hidden">
          <img
            src={image}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-black text-[#183d37]">
              {item.name}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                item.type === "rent"
                  ? "bg-[#e49263] text-[#173d36]"
                  : "bg-[#183d37] text-white"
              }`}
            >
              {item.type === "rent" ? "إيجار" : "بيع"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#a08a5f]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{item.address}</span>
          </div>
          <div className="flex items-center gap-3 pt-1 text-xs font-bold text-[#6b7d76]">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-[#e49263]" />
              {item.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-[#e49263]" />
              {item.bathrooms}
            </span>
          </div>
          <div className="pt-1 text-base font-black text-[#183d37]">
            {numberFormatter.format(item.price)} ج.م
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function RelatedListings({ currentListingId, type, category }) {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    let cancelled = false;

    const fetchRelated = async () => {
      setStatus("loading");
      try {
        const params = new URLSearchParams({ limit: "6" });
        if (type) params.set("type", type);
        if (category) params.set("category", category);

        const res = await fetch(`/api/listing?${params.toString()}`);
        const data = await res.json();
        if (cancelled) return;

        const items = (data.listings || [])
          .filter((item) => item._id !== currentListingId)
          .slice(0, 6);

        setListings(items);
        setStatus("success");
      } catch (err) {
        if (!cancelled) setStatus("error");
      }
    };

    fetchRelated();
    return () => {
      cancelled = true;
    };
  }, [currentListingId, type, category]);

  if (status === "success" && listings.length === 0) return null;

  return (
    <div className="border-t border-[#e7e2d7] pt-8">
      <h2 className="mb-4 text-xl font-black text-[#183d37]">عقارات مشابهة</h2>

      {status === "loading" && (
        <div className="flex h-40 items-center justify-center gap-2 text-[#a08a5f]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-semibold">
            جارٍ تحميل العقارات المشابهة...
          </span>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm font-semibold text-[#a08a5f]">
          تعذّر تحميل العقارات المشابهة حاليًا
        </p>
      )}

      {status === "success" && listings.length > 0 && (
        <div className="scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-3">
          {listings.map((item, i) => (
            <RelatedCard key={item._id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
