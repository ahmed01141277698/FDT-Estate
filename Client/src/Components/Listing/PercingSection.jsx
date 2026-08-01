import { DollarSign, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingSection({ form, handleChange, errors = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 shadow-sm"
      style={{ background: "#fff", borderColor: "rgba(24,61,55,0.1)" }}
    >
      <h2 className="mb-6 text-2xl font-black text-[#183d37]">السعر</h2>

      <div className="space-y-6">
        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            السعر الأساسي
            {form.type === "rent" && (
              <span className="mr-2 text-xs text-[#8a988f]">(شهريًا)</span>
            )}
          </label>

          <div className="relative">
            <DollarSign
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
            />

            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              className={`w-full rounded-xl border py-3 pl-16 pr-11 outline-none transition ${
                errors.price
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6b7a74]">
              ج.م
            </span>
          </div>

          {errors.price && (
            <p className="mt-2 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        {/* Offer */}
        <label
          className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-[#f8f6f2]"
          style={{ borderColor: "rgba(24,61,55,0.12)" }}
        >
          <div className="flex items-center gap-3">
            <BadgePercent size={20} className="text-[#c9a227]" />
            <span className="font-semibold text-[#183d37]">يوجد خصم</span>
          </div>

          <input
            type="checkbox"
            name="offer"
            checked={form.offer}
            onChange={handleChange}
            className="h-5 w-5 accent-[#c9a227]"
          />
        </label>

        {/* Discount */}
        {form.offer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <label className="mb-2 block text-sm font-bold text-[#183d37]">
              السعر بعد الخصم
            </label>

            <div className="relative">
              <DollarSign
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
              />

              <input
                type="number"
                name="discountPrice"
                min="0"
                value={form.discountPrice}
                onChange={handleChange}
                placeholder="0"
                className={`w-full rounded-xl border py-3 pl-16 pr-11 outline-none transition ${
                  errors.discountPrice
                    ? "border-red-500"
                    : "border-[#183d37]/15 focus:border-[#c9a227]"
                }`}
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#6b7a74]">
                ج.م
              </span>
            </div>

            {errors.discountPrice && (
              <p className="mt-2 text-sm text-red-500">
                {errors.discountPrice}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
