// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import ListingItem from "../Components/Listing/ListingItem";

// const Search = () => {
//   const [searchParams] = useSearchParams();

//   const query = searchParams.get("q") || "";
//   const page = Number(searchParams.get("page")) || 1;

//   const [loading, setLoading] = useState(true);
//   const [listings, setListings] = useState([]);
//   const [intent, setIntent] = useState({});
//   const [pagination, setPagination] = useState({});
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetch(
//           `/api/listing/search?q=${encodeURIComponent(query)}&page=${page}`,
//           {
//             credentials: "include",
//           },
//         );

//         const data = await res.json();

//         if (!res.ok || !data.success) {
//           console.error("Search API error:", { status: res.status, data });
//           throw new Error(data?.message || "Search failed");
//         }

//         // Backend returns aggregate results; keep it consistent.
//         setListings(Array.isArray(data.results) ? data.results : []);
//         setIntent(data.intent || {});
//         setPagination(
//           data.pagination || { page: page, limit: 20, total: 0, totalPages: 0 },
//         );
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query, page]);

//   if (loading) {
//     return (
//       <div className="flex justify-center py-24 text-lg font-semibold">
//         جاري البحث...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-5 py-8">
//       <h1 className="text-3xl font-bold mb-2">نتائج البحث</h1>

//       <p className="text-gray-500 mb-8">"{query}"</p>

//       {(intent.location ||
//         intent.propertyType ||
//         intent.purpose ||
//         intent.price) && (
//         <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-3">
//           {intent.location && (
//             <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700">
//               📍 {intent.location}
//             </span>
//           )}

//           {intent.propertyType && (
//             <span className="px-4 py-2 rounded-full bg-green-100 text-green-700">
//               🏠 {intent.propertyType}
//             </span>
//           )}

//           {intent.purpose && (
//             <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
//               {intent.purpose === "sell" ? "للبيع" : "للإيجار"}
//             </span>
//           )}

//           {intent.price && (
//             <span className="px-4 py-2 rounded-full bg-red-100 text-red-700">
//               💰 السعر
//             </span>
//           )}
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 text-red-700 rounded-lg p-4">{error}</div>
//       )}

//       {!error && listings.length === 0 && (
//         <div className="text-center py-24">
//           <h2 className="text-2xl font-bold">لا توجد نتائج</h2>

//           <p className="text-gray-500 mt-3">حاول استخدام كلمات مختلفة.</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
//         {listings.map((listing) => (
//           <ListingItem key={listing._id} listing={listing} />
//         ))}
//       </div>

//       {pagination.totalPages > 1 && (
//         <div className="flex justify-center gap-3 mt-10">
//           {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
//             (num) => (
//               <a
//                 key={num}
//                 href={`/search?q=${encodeURIComponent(query)}&page=${num}`}
//                 className={`px-4 py-2 rounded-lg ${
//                   page === num ? "bg-blue-600 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 {num}
//               </a>
//             ),
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Home, Tag, DollarSign, SearchX } from "lucide-react";
import PropertyCard from "../Components/HomeSections/PropertyCard";

const Search = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [intent, setIntent] = useState({});
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/api/listing/search?q=${encodeURIComponent(query)}&page=${page}`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error("Search API error:", { status: res.status, data });
          throw new Error(data?.message || "Search failed");
        }

        // Backend returns aggregate results; keep it consistent.
        setListings(Array.isArray(data.results) ? data.results : []);
        setIntent(data.intent || {});
        setPagination(
          data.pagination || { page: page, limit: 20, total: 0, totalPages: 0 },
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-lg font-bold text-[#a9beb5]"
        style={{
          background: "linear-gradient(180deg, #183d37 0%, #0e0e16 45%)",
        }}
      >
        جاري البحث...
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden px-5 py-16 text-white sm:px-8 lg:px-12"
      style={{ background: "linear-gradient(180deg, #183d37 0%, #0e0e16 45%)" }}
    >
      <div className="pointer-events-none absolute -left-24 top-10 size-96 rounded-full bg-[#c9a227]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="text-gold-gradient text-sm font-extrabold">نتائج البحث</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          نتائج البحث
        </h1>
        <p className="mt-2 text-[#a9beb5]">"{query}"</p>

        {(intent.location ||
          intent.propertyType ||
          intent.purpose ||
          intent.price) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {intent.location && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#f0ede6]">
                <MapPin size={14} className="text-[#c9a227]" />
                {intent.location}
              </span>
            )}

            {intent.propertyType && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#f0ede6]">
                <Home size={14} className="text-[#c9a227]" />
                {intent.propertyType}
              </span>
            )}

            {intent.purpose && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#f0ede6]">
                <Tag size={14} className="text-[#c9a227]" />
                {intent.purpose === "sell" ? "للبيع" : "للإيجار"}
              </span>
            )}

            {intent.price && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-[#f0ede6]">
                <DollarSign size={14} className="text-[#c9a227]" />
                السعر
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!error && listings.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <SearchX size={40} className="mb-4 text-[#8a988f]" />
            <h2 className="text-2xl font-black">لا توجد نتائج</h2>
            <p className="mt-3 text-[#a9beb5]">حاول استخدام كلمات مختلفة.</p>
          </div>
        )}

        {!error && listings.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-6 sm:justify-start">
            {listings.map((listing, index) => (
              <PropertyCard
                key={listing._id}
                property={listing}
                index={index}
              />
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (num) => (
                <Link
                  key={num}
                  to={`/search?q=${encodeURIComponent(query)}&page=${num}`}
                  className={`grid size-9 place-items-center rounded-full text-sm font-bold transition ${
                    page === num
                      ? "bg-[#c9a227] text-[#183d37]"
                      : "bg-white/5 text-[#a9beb5] hover:bg-white/10"
                  }`}
                >
                  {num}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
