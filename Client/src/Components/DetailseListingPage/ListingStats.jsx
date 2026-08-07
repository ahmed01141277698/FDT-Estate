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
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#e7e2d7] bg-white px-3 py-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e49263]/10">
        <Icon className="h-5 w-5 text-[#e49263]" strokeWidth={1.75} />
      </div>
      <span className="text-lg font-black text-[#183d37]">{value}</span>
      <span className="text-xs font-bold text-[#a08a5f]">{label}</span>
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
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4"
    >
      <StatCard icon={BedDouble} value={bedrooms} label="غرف النوم" />
      <StatCard icon={Bath} value={bathrooms} label="الحمامات" />
      <StatCard
        icon={Ruler}
        value={area ? `${area} م²` : undefined}
        label="المساحة"
      />
      <StatCard
        icon={Car}
        value={parking ? "متاح" : "غير متاح"}
        label="موقف سيارات"
      />
      <StatCard
        icon={Sofa}
        value={furnished ? "مفروشة" : "غير مفروشة"}
        label="التأثيث"
      />
    </motion.div>
  );
}
