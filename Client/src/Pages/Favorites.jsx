import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heart, Loader2 } from "lucide-react";
import PropertyCard from "../Components/HomeSections/PropertyCard";
import {
  favoritesRequestStart,
  favoritesRequestSuccess,
  favoritesRequestFailure,
} from "../../redux/favoriteSlice/favoriteSlice";

export default function Favorites() {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const { items: favorites, loading } = useSelector((state) => state.favorites);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        dispatch(favoritesRequestStart());

        const token = localStorage.getItem("token");

        const res = await fetch("/api/listing/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "فشل تحميل المفضلة");
        }

        dispatch(favoritesRequestSuccess(data.listings || []));
      } catch (err) {
        dispatch(favoritesRequestFailure(err.message));
        setError(err.message);
      }
    };

    fetchFavorites();
  }, [currentUser, dispatch]);

  return (
    <section dir="rtl" className="min-h-screen bg-[#f7f5f0]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#183d37] px-6 py-16 text-white">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#e49263]/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#e8c56d]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e49263] text-[#183d37]">
              <Heart size={28} fill="currentColor" />
            </div>

            <div>
              <h1 className="text-3xl font-black">المفضلة</h1>

              <p className="mt-1 text-sm text-white/70">
                جميع العقارات التي قمت بحفظها
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats */}
        <div className="mb-8 rounded-3xl border border-[#e7e2d7] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6b7d76]">عدد العقارات المحفوظة</p>

              <h2 className="mt-2 text-4xl font-black text-[#183d37]">
                {favorites.length}
              </h2>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e49263]/10">
              <Heart className="text-[#e49263]" size={30} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-[#183d37]" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <div className="rounded-3xl border border-[#e7e2d7] bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e49263]/10">
              <Heart size={34} className="text-[#e49263]" />
            </div>

            <h3 className="text-2xl font-black text-[#183d37]">
              لا توجد عقارات محفوظة
            </h3>

            <p className="mt-3 text-[#6b7d76]">
              ابدأ بحفظ العقارات التي تعجبك لتظهر هنا لاحقًا
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && favorites.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((property, index) => (
              <PropertyCard
                key={property._id}
                property={property}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
