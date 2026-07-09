import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("ar-EG");

export default function ListingHeader({ listing }) {
  const {
    name,
    type,
    offer,
    discountPrice,
    price: regularPrice,
    address,
  } = listing;

  const isRent = type === "rent";
  const price = offer && discountPrice ? discountPrice : regularPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isRent
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isRent ? "للإيجار" : "للبيع"}
        </span>
        {offer && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
            عرض خاص
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-snug">
        {name}
      </h1>

      <div className="flex items-center gap-1.5 text-slate-500">
        <MapPin className="w-4 h-4 shrink-0" />
        <span className="text-sm md:text-base">{address}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-end gap-3 pt-1"
      >
        <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-l from-blue-700 to-blue-500 bg-clip-text text-transparent">
          {numberFormatter.format(price)} ج.م
        </span>
        {isRent && (
          <span className="text-slate-400 text-sm font-medium mb-1">
            / شهريًا
          </span>
        )}
        {offer && (
          <span className="text-slate-400 text-base line-through mb-1">
            {numberFormatter.format(regularPrice)}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
