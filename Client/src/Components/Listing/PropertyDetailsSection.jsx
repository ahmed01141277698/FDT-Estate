import { BedDouble, Bath, Ruler } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyDetailsSection({
  form,
  handleChange,
  errors = {},
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 shadow-sm"
      style={{ background: "#fff", borderColor: "rgba(24,61,55,0.1)" }}
    >
      <h2 className="mb-6 text-2xl font-black text-[#183d37]">تفاصيل العقار</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Bedrooms */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            غرف النوم
          </label>

          <div className="relative">
            <BedDouble
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
            />

            <input
              type="number"
              name="bedrooms"
              min="0"
              value={form.bedrooms}
              onChange={handleChange}
              className={`w-full rounded-xl border py-3 pl-4 pr-11 outline-none transition ${
                errors.bedrooms
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />
          </div>

          {errors.bedrooms && (
            <p className="mt-2 text-sm text-red-500">{errors.bedrooms}</p>
          )}
        </div>

        {/* Bathrooms */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            الحمامات
          </label>

          <div className="relative">
            <Bath
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
            />

            <input
              type="number"
              name="bathrooms"
              min="0"
              value={form.bathrooms}
              onChange={handleChange}
              className={`w-full rounded-xl border py-3 pl-4 pr-11 outline-none transition ${
                errors.bathrooms
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />
          </div>

          {errors.bathrooms && (
            <p className="mt-2 text-sm text-red-500">{errors.bathrooms}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            المساحة (م²)
          </label>

          <div className="relative">
            <Ruler
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
            />

            <input
              type="number"
              name="area"
              min="1"
              value={form.area}
              onChange={handleChange}
              className={`w-full rounded-xl border py-3 pl-4 pr-11 outline-none transition ${
                errors.area
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />
          </div>

          {errors.area && (
            <p className="mt-2 text-sm text-red-500">{errors.area}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
