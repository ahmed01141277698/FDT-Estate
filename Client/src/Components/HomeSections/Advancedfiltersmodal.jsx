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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2622]/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-[#e7e2d7] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#183d37]">فلاتر متقدمة</h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-[#183d37]/5 text-[#6b7d76] transition hover:text-[#183d37]"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 text-sm font-bold text-[#183d37]">
            نوع العقار
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm font-semibold text-[#183d37] outline-none focus:border-[#e49263]"
            >
              <option value="">الكل</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-bold text-[#183d37]">
            الغرض
            <select
              value={form.type}
              onChange={handleChange("type")}
              className="rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm font-semibold text-[#183d37] outline-none focus:border-[#e49263]"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-bold text-[#183d37]">
            أقل سعر
            <input
              type="number"
              min="0"
              value={form.minPrice}
              onChange={handleChange("minPrice")}
              placeholder="بدون حد أدنى"
              className="rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#a9beb5] focus:border-[#e49263]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-bold text-[#183d37]">
            أعلى سعر
            <input
              type="number"
              min="0"
              value={form.maxPrice}
              onChange={handleChange("maxPrice")}
              placeholder="بدون حد أقصى"
              className="rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#a9beb5] focus:border-[#e49263]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-bold text-[#183d37]">
            الحد الأدنى لعدد الغرف
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={handleChange("bedrooms")}
              className="rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm font-semibold text-[#183d37] outline-none focus:border-[#e49263]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-bold text-[#183d37]">
            الحد الأدنى لعدد الحمامات
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={handleChange("bathrooms")}
              className="rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm font-semibold text-[#183d37] outline-none focus:border-[#e49263]"
            />
          </label>

          <button
            type="submit"
            className="col-span-full mt-2 rounded-xl bg-[#e49263] py-3 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
          >
            تطبيق الفلاتر
          </button>
        </form>
      </div>
    </div>
  );
}
