import { Building, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyTypeSection({ form, setForm }) {
  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">نوع العقار</h2>

      <div className="grid grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => handleTypeChange("sell")}
          className={`rounded-2xl border p-6 transition-all duration-200

          ${
            form.type === "sell"
              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
        >
          <Building size={34} className="mx-auto mb-3" />

          <h3 className="font-bold text-lg">للبيع</h3>

          <p className="text-sm opacity-80 mt-1">بيع العقار نهائياً</p>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("rent")}
          className={`rounded-2xl border p-6 transition-all duration-200

          ${
            form.type === "rent"
              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          }`}
        >
          <KeyRound size={34} className="mx-auto mb-3" />

          <h3 className="font-bold text-lg">للإيجار</h3>

          <p className="text-sm opacity-80 mt-1">تأجير العقار</p>
        </button>
      </div>
    </motion.div>
  );
}
