import { CarFront, Sofa } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection({ form, handleChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 shadow-sm"
      style={{ background: "#fff", borderColor: "rgba(24,61,55,0.1)" }}
    >
      <h2 className="mb-6 text-2xl font-black text-[#183d37]">المميزات</h2>

      <div className="space-y-5">
        {/* Furnished */}
        <label
          className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
            form.furnished
              ? "border-[#c9a227] bg-[#f8f6f2]"
              : "border-[#183d37]/12 hover:border-[#c9a227]/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                form.furnished
                  ? "bg-[#183d37] text-white"
                  : "bg-[#f8f6f2] text-[#8a988f]"
              }`}
            >
              <Sofa size={22} />
            </div>

            <div>
              <h3 className="font-bold text-[#183d37]">مفروش</h3>
              <p className="text-sm text-[#6b7a74]">
                العقار يحتوي على أثاث كامل.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            name="furnished"
            checked={form.furnished}
            onChange={handleChange}
            className="h-5 w-5 accent-[#c9a227]"
          />
        </label>

        {/* Parking */}
        <label
          className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
            form.parking
              ? "border-[#c9a227] bg-[#f8f6f2]"
              : "border-[#183d37]/12 hover:border-[#c9a227]/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                form.parking
                  ? "bg-[#183d37] text-white"
                  : "bg-[#f8f6f2] text-[#8a988f]"
              }`}
            >
              <CarFront size={22} />
            </div>

            <div>
              <h3 className="font-bold text-[#183d37]">موقف سيارات</h3>
              <p className="text-sm text-[#6b7a74]">
                يوجد جراج أو مكان مخصص للسيارة.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            name="parking"
            checked={form.parking}
            onChange={handleChange}
            className="h-5 w-5 accent-[#c9a227]"
          />
        </label>
      </div>
    </motion.div>
  );
}
