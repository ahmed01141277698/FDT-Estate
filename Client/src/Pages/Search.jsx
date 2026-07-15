import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListingItem from "../Components/Listing/ListingItem";

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
      <div className="flex justify-center py-24 text-lg font-semibold">
        جاري البحث...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-2">نتائج البحث</h1>

      <p className="text-gray-500 mb-8">"{query}"</p>

      {(intent.location ||
        intent.propertyType ||
        intent.purpose ||
        intent.price) && (
        <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-3">
          {intent.location && (
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700">
              📍 {intent.location}
            </span>
          )}

          {intent.propertyType && (
            <span className="px-4 py-2 rounded-full bg-green-100 text-green-700">
              🏠 {intent.propertyType}
            </span>
          )}

          {intent.purpose && (
            <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
              {intent.purpose === "sell" ? "للبيع" : "للإيجار"}
            </span>
          )}

          {intent.price && (
            <span className="px-4 py-2 rounded-full bg-red-100 text-red-700">
              💰 السعر
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-4">{error}</div>
      )}

      {!error && listings.length === 0 && (
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold">لا توجد نتائج</h2>

          <p className="text-gray-500 mt-3">حاول استخدام كلمات مختلفة.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (num) => (
              <a
                key={num}
                href={`/search?q=${encodeURIComponent(query)}&page=${num}`}
                className={`px-4 py-2 rounded-lg ${
                  page === num ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {num}
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
