import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import PropertyCard from "./PropertyCard";
import AdvancedFiltersModal from "./Advancedfiltersmodal.jsx";

export default function Discover() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // جلب التصنيفات الفعلية الموجودة في قاعدة البيانات لبناء أزرار الفلاتر.
  useEffect(() => {
    fetch(`api/listing/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);
  // جلب العقارات كل ما يتغيّر الفلتر البسيط أو الفلاتر المتقدمة.
  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (advancedFilters) {
      Object.entries(advancedFilters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          params.set(key, value);
        }
      });
    } else if (activeCategory !== "الكل") {
      params.set("category", activeCategory);
    }
    params.set("limit", "6");

    setLoading(true);
    setError("");

    fetch(`api/listing?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("تعذّر تحميل العقارات");
        return res.json();
      })
      .then((data) => setListings(data.listings || []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [activeCategory, advancedFilters]);

  const handleSelectCategory = (category) => {
    setAdvancedFilters(null);
    setActiveCategory(category);
  };

  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    setActiveCategory("الكل");
    setShowFiltersModal(false);
  };

  return (
    <section
      id="discover"
      className="relative overflow-hidden bg-gradient-to-b from-[#183d37] to-[#0e0e16] px-5 py-20 sm:px-8 lg:px-12"
    >
      <div className="pointer-events-none absolute -left-24 top-10 size-96 rounded-full bg-[#c9a227]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-gold-gradient text-sm font-extrabold">
              أبرز اختيارات هذا الأسبوع
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#f0ede6] sm:text-4xl">
              عقارات تستحق الزيارة
            </h2>
            <p className="mt-3 text-sm text-[#a9beb5]">
              اختيارات منتقاة بعناية من مختلف أنحاء مصر، لتناسب ذوقك.
            </p>
          </div>

          <Link
            to="/AllListings"
            className="flex items-center gap-2 text-sm font-extrabold text-[#e8c56d] transition hover:text-[#f2b17e]"
          >
            استعرض جميع العقارات <ArrowLeft size={17} />
          </Link>
        </div>

        <div className="mt-9 flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectCategory("الكل")}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              activeCategory === "الكل" && !advancedFilters
                ? "border-[#c9a227] bg-[#183d37] text-[#f0ede6]"
                : "border-white/10 bg-white/5 text-[#a9beb5] hover:border-[#c9a227]/60"
            }`}
          >
            الكل
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelectCategory(category)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                activeCategory === category && !advancedFilters
                  ? "border-[#c9a227] bg-[#183d37] text-[#f0ede6]"
                  : "border-white/10 bg-white/5 text-[#a9beb5] hover:border-[#c9a227]/60"
              }`}
            >
              {category}
            </button>
          ))}

          <button
            onClick={() => setShowFiltersModal(true)}
            className={`mr-auto flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
              advancedFilters
                ? "border-[#c9a227] bg-[#183d37] text-[#f0ede6]"
                : "border-white/10 bg-white/5 text-[#a9beb5] hover:border-[#c9a227]/60"
            }`}
          >
            <SlidersHorizontal size={16} /> فلاتر متقدمة
          </button>
        </div>

        {loading && (
          <p className="mt-10 text-center text-sm font-semibold text-[#a9beb5]">
            جاري تحميل العقارات...
          </p>
        )}

        {!loading && error && (
          <p className="mt-10 text-center text-sm font-semibold text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="mt-10 text-center text-sm font-semibold text-[#a9beb5]">
            لا توجد عقارات ضمن هذا التصنيف حاليًا.
          </p>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-6 sm:justify-start">
            {listings.map((listing, index) => (
              <PropertyCard
                key={listing._id}
                property={listing}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {showFiltersModal && (
        <AdvancedFiltersModal
          categories={categories}
          onClose={() => setShowFiltersModal(false)}
          onApply={handleApplyAdvancedFilters}
        />
      )}
    </section>
  );
}
