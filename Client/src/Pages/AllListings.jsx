// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { SlidersHorizontal } from "lucide-react";
// import PropertyCard from "../Components/HomeSections/PropertyCard";
// import AdvancedFiltersModal from "../Components/HomeSections/Advancedfiltersmodal";

// const PAGE_SIZE = 12;

// export default function AllListings() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(
//     searchParams.get("category") || "الكل",
//   );
//   const [advancedFilters, setAdvancedFilters] = useState(null);
//   const [listings, setListings] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showFiltersModal, setShowFiltersModal] = useState(false);

//   useEffect(() => {
//     fetch(`api/listing/categories`)
//       .then((res) => res.json())
//       .then((data) => setCategories(Array.isArray(data) ? data : []))
//       .catch(() => setCategories([]));
//   }, []);
//   useEffect(() => {
//     const categoryFromUrl = searchParams.get("category") || "الكل";
//     setActiveCategory(categoryFromUrl);
//     setAdvancedFilters(null);
//     setPage(1);
//   }, [searchParams]);

//   useEffect(() => {
//     const controller = new AbortController();

//     const params = new URLSearchParams();
//     if (advancedFilters) {
//       Object.entries(advancedFilters).forEach(([key, value]) => {
//         if (value !== "" && value !== undefined && value !== null) {
//           params.set(key, value);
//         }
//       });
//     } else if (activeCategory !== "الكل") {
//       params.set("category", activeCategory);
//     }
//     params.set("page", page);
//     params.set("limit", PAGE_SIZE);

//     setLoading(true);
//     setError("");

//     fetch(`api/listing?${params.toString()}`, {
//       signal: controller.signal,
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("تعذّر تحميل العقارات");
//         return res.json();
//       })
//       .then((data) => {
//         setListings(data.listings || []);
//         setTotalPages(data.totalPages || 1);
//       })
//       .catch((err) => {
//         if (err.name !== "AbortError") setError(err.message);
//       })
//       .finally(() => setLoading(false));

//     return () => controller.abort();
//   }, [activeCategory, advancedFilters, page]);

//   const handleSelectCategory = (category) => {
//     setAdvancedFilters(null);
//     setActiveCategory(category);
//     setPage(1);
//     setSearchParams(category === "الكل" ? {} : { category });
//   };

//   const handleApplyAdvancedFilters = (filters) => {
//     setAdvancedFilters(filters);
//     setActiveCategory("الكل");
//     setPage(1);
//     setShowFiltersModal(false);
//   };

//   return (
//     <main className="min-h-screen bg-[#0e0e16] px-5 py-16 text-white sm:px-8 lg:px-12">
//       <div className="mx-auto max-w-7xl">
//         <p className="text-gold-gradient text-sm font-extrabold">كل العقارات</p>
//         <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
//           تصفّح جميع العقارات المتاحة
//         </h1>

//         <div className="mt-8 flex flex-wrap gap-2">
//           <button
//             onClick={() => handleSelectCategory("الكل")}
//             className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
//               activeCategory === "الكل" && !advancedFilters
//                 ? "border-[#c9a227] bg-[#183d37] text-[#f0ede6]"
//                 : "border-white/10 bg-white/5 text-[#a9beb5] hover:border-[#c9a227]/60"
//             }`}
//           >
//             الكل
//           </button>

//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => handleSelectCategory(category)}
//               className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
//                 activeCategory === category && !advancedFilters
//                   ? "border-[#c9a227] bg-[#183d37] text-[#f0ede6]"
//                   : "border-white/10 bg-white/5 text-[#a9beb5] hover:border-[#c9a227]/60"
//               }`}
//             >
//               {category}
//             </button>
//           ))}

//           <button
//             onClick={() => setShowFiltersModal(true)}
//             className={`mr-auto flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
//               advancedFilters
//                 ? "border-[#c9a227] bg-[#183d37] text-[#f0ede6]"
//                 : "border-white/10 bg-white/5 text-[#a9beb5] hover:border-[#c9a227]/60"
//             }`}
//           >
//             <SlidersHorizontal size={16} /> فلاتر متقدمة
//           </button>
//         </div>

//         {loading && (
//           <p className="mt-14 text-center text-sm font-semibold text-[#a9beb5]">
//             جاري تحميل العقارات...
//           </p>
//         )}

//         {!loading && error && (
//           <p className="mt-14 text-center text-sm font-semibold text-red-400">
//             {error}
//           </p>
//         )}

//         {!loading && !error && listings.length === 0 && (
//           <p className="mt-14 text-center text-sm font-semibold text-[#a9beb5]">
//             لا توجد عقارات مطابقة لهذا البحث.
//           </p>
//         )}

//         {!loading && !error && listings.length > 0 && (
//           <>
//             <div className="mt-10 flex flex-wrap justify-center gap-6 sm:justify-start">
//               {listings.map((listing, index) => (
//                 <PropertyCard
//                   key={listing._id}
//                   property={listing}
//                   index={index}
//                 />
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-12 flex items-center justify-center gap-2">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (p) => (
//                     <button
//                       key={p}
//                       onClick={() => setPage(p)}
//                       className={`grid size-9 place-items-center rounded-full text-sm font-bold transition ${
//                         page === p
//                           ? "bg-[#c9a227] text-[#183d37]"
//                           : "bg-white/5 text-[#a9beb5] hover:bg-white/10"
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   ),
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {showFiltersModal && (
//         <AdvancedFiltersModal
//           categories={categories}
//           onClose={() => setShowFiltersModal(false)}
//           onApply={handleApplyAdvancedFilters}
//         />
//       )}
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import PropertyCard from "../Components/HomeSections/PropertyCard";
import AdvancedFiltersModal from "../Components/HomeSections/Advancedfiltersmodal";

const PAGE_SIZE = 12;

export default function AllListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "الكل",
  );
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    fetch(`api/listing/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "الكل";
    setActiveCategory(categoryFromUrl);
    setAdvancedFilters(null);
    setPage(1);
  }, [searchParams]);

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
    params.set("page", page);
    params.set("limit", PAGE_SIZE);

    setLoading(true);
    setError("");

    fetch(`api/listing?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("تعذّر تحميل العقارات");
        return res.json();
      })
      .then((data) => {
        setListings(data.listings || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [activeCategory, advancedFilters, page]);

  const handleSelectCategory = (category) => {
    setAdvancedFilters(null);
    setActiveCategory(category);
    setPage(1);
    setSearchParams(category === "الكل" ? {} : { category });
  };

  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    setActiveCategory("الكل");
    setPage(1);
    setShowFiltersModal(false);
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black tracking-tight text-[#183d37] sm:text-5xl">
          كل العقارات
        </h1>
        <p className="mt-4 text-base font-semibold text-[#6b7d76] sm:text-lg">
          تصفّح جميع العقارات المتاحة
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-[28px] sm:border sm:border-[#e7e2d7] sm:bg-white/70 sm:p-2.5 sm:shadow-sm sm:backdrop-blur-sm">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button
              onClick={() => handleSelectCategory("الكل")}
              className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                activeCategory === "الكل" && !advancedFilters
                  ? "border-[#183d37] bg-[#183d37] text-white"
                  : "border-[#e7e2d7] bg-white text-[#6b7d76] hover:border-[#e49263]/50 hover:text-[#e49263] sm:border-transparent sm:bg-transparent"
              }`}
            >
              الكل
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleSelectCategory(category)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  activeCategory === category && !advancedFilters
                    ? "border-[#183d37] bg-[#183d37] text-white"
                    : "border-[#e7e2d7] bg-white text-[#6b7d76] hover:border-[#e49263]/50 hover:text-[#e49263] sm:border-transparent sm:bg-transparent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFiltersModal(true)}
            className={`flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition sm:mr-auto sm:w-auto ${
              advancedFilters
                ? "border-[#e49263] bg-[#e49263] text-[#173d36]"
                : "border-[#e7e2d7] bg-white text-[#183d37] hover:border-[#e49263]/60 hover:text-[#e49263]"
            }`}
          >
            <SlidersHorizontal size={16} /> فلاتر متقدمة
          </button>
        </div>

        {loading && (
          <p className="mt-14 text-center text-sm font-semibold text-[#a08a5f]">
            جاري تحميل العقارات...
          </p>
        )}

        {!loading && error && (
          <p className="mt-14 text-center text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="mt-14 text-center text-sm font-semibold text-[#a08a5f]">
            لا توجد عقارات مطابقة لهذا البحث.
          </p>
        )}

        {!loading && !error && listings.length > 0 && (
          <>
            <div className="mt-10 flex flex-wrap justify-center gap-6 sm:justify-start">
              {listings.map((listing, index) => (
                <PropertyCard
                  key={listing._id}
                  property={listing}
                  index={index}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`grid size-9 place-items-center rounded-full text-sm font-bold transition ${
                        page === p
                          ? "bg-[#e49263] text-[#173d36]"
                          : "bg-[#183d37]/5 text-[#183d37] hover:bg-[#183d37]/10"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showFiltersModal && (
        <AdvancedFiltersModal
          categories={categories}
          onClose={() => setShowFiltersModal(false)}
          onApply={handleApplyAdvancedFilters}
        />
      )}
    </main>
  );
}
