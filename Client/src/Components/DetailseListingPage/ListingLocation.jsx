import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export default function ListingLocation({ address }) {
  if (!address) return null;

  return (
    <div className="border-t border-slate-100 pt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">الموقع</h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
      >
        <div className="relative h-56 md:h-72 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_1px_1px,_#cbd5e1_1px,_transparent_0)] bg-[length:22px_22px]" />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: 0.15,
            }}
            className="relative w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30"
          >
            <MapPin className="w-6 h-6 text-white" fill="currentColor" />
          </motion.div>
          <span className="absolute bottom-3 left-3 text-[11px] font-medium text-slate-400 bg-white/70 backdrop-blur px-2 py-1 rounded-md">
            الخريطة التفاعلية قريبًا
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-slate-700 text-sm">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            {address}
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            فتح في الخرائط
          </a>
        </div>
      </motion.div>
    </div>
  );
}
