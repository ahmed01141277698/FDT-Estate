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
      className="rounded-2xl border p-6 shadow-sm"
      style={{ background: "#fff", borderColor: "rgba(24,61,55,0.1)" }}
    >
      <h2 className="mb-6 text-2xl font-black text-[#183d37]">نوع العقار</h2>

      <div className="grid grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => handleTypeChange("sell")}
          className={`rounded-2xl border p-6 transition-all duration-200 ${
            form.type === "sell"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg"
              : "border-[#183d37]/15 hover:border-[#c9a227] hover:bg-[#f8f6f2]"
          }`}
        >
          <Building size={34} className="mx-auto mb-3" />
          <h3 className="text-lg font-bold">للبيع</h3>
          <p
            className={`mt-1 text-sm ${form.type === "sell" ? "opacity-80" : "text-[#6b7a74]"}`}
          >
            بيع العقار نهائيًا
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange("rent")}
          className={`rounded-2xl border p-6 transition-all duration-200 ${
            form.type === "rent"
              ? "border-blue-600 bg-blue-600 text-white shadow-lg"
              : "border-[#183d37]/15 hover:border-[#c9a227] hover:bg-[#f8f6f2]"
          }`}
        >
          <KeyRound size={34} className="mx-auto mb-3" />
          <h3 className="text-lg font-bold">للإيجار</h3>
          <p
            className={`mt-1 text-sm ${form.type === "rent" ? "opacity-80" : "text-[#6b7a74]"}`}
          >
            تأجير العقار
          </p>
        </button>
      </div>
    </motion.div>
  );
}
