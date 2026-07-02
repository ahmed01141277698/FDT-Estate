import { CarFront, Sofa } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection({ form, handleChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">المميزات</h2>

      <div className="space-y-5">
        {/* Furnished */}

        <label
          className={`flex items-center justify-between rounded-2xl border p-5 cursor-pointer transition

          ${
            form.furnished
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center

              ${
                form.furnished
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Sofa size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">مفروش</h3>

              <p className="text-sm text-gray-500">
                العقار يحتوي على أثاث كامل.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            name="furnished"
            checked={form.furnished}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
        </label>

        {/* Parking */}

        <label
          className={`flex items-center justify-between rounded-2xl border p-5 cursor-pointer transition

          ${
            form.parking
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center

              ${
                form.parking
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <CarFront size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">موقف سيارات</h3>

              <p className="text-sm text-gray-500">
                يوجد جراج أو مكان مخصص للسيارة.
              </p>
            </div>
          </div>

          <input
            type="checkbox"
            name="parking"
            checked={form.parking}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
        </label>
      </div>
    </motion.div>
  );
}
