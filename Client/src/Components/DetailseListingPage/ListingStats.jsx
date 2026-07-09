import { motion } from "framer-motion";
import { BedDouble, Bath, Car, Ruler, Sofa } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function StatCard({ icon: Icon, value, label }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-100 rounded-2xl py-5 px-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </motion.div>
  );
}

export default function ListingStats({ listing }) {
  const { bedrooms, bathrooms, parking, area, furnished } = listing;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4"
    >
      <StatCard icon={BedDouble} value={bedrooms} label="غرف النوم" />
      <StatCard icon={Bath} value={bathrooms} label="الحمامات" />
      <StatCard icon={Ruler} value={area ? `${area} م²` : undefined} label="المساحة" />
      <StatCard icon={Car} value={parking ? "متاح" : "غير متاح"} label="موقف سيارات" />
      <StatCard icon={Sofa} value={furnished ? "مفروشة" : "غير مفروشة"} label="التأثيث" />
    </motion.div>
  );
}
