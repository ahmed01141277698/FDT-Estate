import { DollarSign, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingSection({ form, handleChange, errors = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">السعر</h2>

      <div className="space-y-6">
        {/* Price */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            السعر الأساسي
            {form.type === "rent" && (
              <span className="text-gray-400 text-xs mr-2">(شهرياً)</span>
            )}
          </label>

          <div className="relative">
            <DollarSign
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              className={`w-full rounded-xl border py-3 pr-11 pl-16 outline-none transition

              ${
                errors.price
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              ج.م
            </span>
          </div>

          {errors.price && (
            <p className="text-red-500 text-sm mt-2">{errors.price}</p>
          )}
        </div>

        {/* Offer */}

        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <BadgePercent size={20} className="text-blue-600" />

            <span className="font-medium">يوجد خصم</span>
          </div>

          <input
            type="checkbox"
            name="offer"
            checked={form.offer}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
        </label>

        {/* Discount */}

        {form.offer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              السعر بعد الخصم
            </label>

            <div className="relative">
              <DollarSign
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="number"
                name="discountPrice"
                min="0"
                value={form.discountPrice}
                onChange={handleChange}
                placeholder="0"
                className={`w-full rounded-xl border py-3 pr-11 pl-16 outline-none transition

                ${
                  errors.discountPrice
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                ج.م
              </span>
            </div>

            {errors.discountPrice && (
              <p className="text-red-500 text-sm mt-2">
                {errors.discountPrice}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
