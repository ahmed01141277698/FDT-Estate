import { useState } from "react";
import { X } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "", label: "الكل" },
  { value: "sell", label: "للبيع" },
  { value: "rent", label: "للإيجار" },
];

export default function AdvancedFiltersModal({
  categories = [],
  onClose,
  onApply,
}) {
  const [form, setForm] = useState({
    category: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
  });

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-lg rounded-3xl border border-[#c9a227]/20 bg-[#0e0e16] p-6 shadow-2xl"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#f0ede6]">فلاتر متقدمة</h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-white/5 text-[#a9beb5] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#a9beb5]">
            نوع العقار
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0ede6] outline-none focus:border-[#c9a227]/60"
            >
              <option value="">الكل</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#a9beb5]">
            الغرض
            <select
              value={form.type}
              onChange={handleChange("type")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0ede6] outline-none focus:border-[#c9a227]/60"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#a9beb5]">
            أقل سعر
            <input
              type="number"
              min="0"
              value={form.minPrice}
              onChange={handleChange("minPrice")}
              placeholder="بدون حد أدنى"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0ede6] outline-none placeholder:text-[#5f6f68] focus:border-[#c9a227]/60"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#a9beb5]">
            أعلى سعر
            <input
              type="number"
              min="0"
              value={form.maxPrice}
              onChange={handleChange("maxPrice")}
              placeholder="بدون حد أقصى"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0ede6] outline-none placeholder:text-[#5f6f68] focus:border-[#c9a227]/60"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#a9beb5]">
            الحد الأدنى لعدد الغرف
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={handleChange("bedrooms")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0ede6] outline-none focus:border-[#c9a227]/60"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold text-[#a9beb5]">
            الحد الأدنى لعدد الحمامات
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={handleChange("bathrooms")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0ede6] outline-none focus:border-[#c9a227]/60"
            />
          </label>

          <button
            type="submit"
            className="col-span-full mt-2 rounded-xl py-3 text-sm font-extrabold text-[#183d37]"
            style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
          >
            تطبيق الفلاتر
          </button>
        </form>
      </div>
    </div>
  );
}
