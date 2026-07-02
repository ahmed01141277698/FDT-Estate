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
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل العقار</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bedrooms */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            غرف النوم
          </label>

          <div className="relative">
            <BedDouble
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="number"
              name="bedrooms"
              min="0"
              value={form.bedrooms}
              onChange={handleChange}
              className={`w-full rounded-xl border py-3 pr-11 pl-4 outline-none transition

              ${
                errors.bedrooms
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          {errors.bedrooms && (
            <p className="text-red-500 text-sm mt-2">{errors.bedrooms}</p>
          )}
        </div>

        {/* Bathrooms */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الحمامات
          </label>

          <div className="relative">
            <Bath
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="number"
              name="bathrooms"
              min="0"
              value={form.bathrooms}
              onChange={handleChange}
              className={`w-full rounded-xl border py-3 pr-11 pl-4 outline-none transition

              ${
                errors.bathrooms
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          {errors.bathrooms && (
            <p className="text-red-500 text-sm mt-2">{errors.bathrooms}</p>
          )}
        </div>

        {/* Area */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            المساحة (م²)
          </label>

          <div className="relative">
            <Ruler
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="number"
              name="area"
              min="1"
              value={form.area}
              onChange={handleChange}
              className={`w-full rounded-xl border py-3 pr-11 pl-4 outline-none transition

              ${
                errors.area
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          {errors.area && (
            <p className="text-red-500 text-sm mt-2">{errors.area}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
