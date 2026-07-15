import { Link } from "react-router-dom";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";

const ListingItem = ({ listing }) => {
  const image =
    listing.imageUrl?.[0]?.url || "https://placehold.co/800x600?text=No+Image";

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={listing.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4">
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold text-white ${
              listing.type === "rent" ? "bg-blue-600" : "bg-emerald-600"
            }`}
          >
            {listing.type === "rent" ? "للإيجار" : "للبيع"}
          </span>
        </div>

        {listing.offer && (
          <div className="absolute top-4 right-4 rounded-full bg-red-600 px-3 py-1 text-white text-sm font-bold">
            عرض
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-slate-800 line-clamp-1">
          {listing.name}
        </h2>

        <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
          <FaMapMarkerAlt />
          <span className="line-clamp-1">{listing.address}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-gray-600">{listing.description}</p>

        <div className="mt-4 text-2xl font-bold text-blue-600">
          {listing.price?.toLocaleString()} ج.م
        </div>

        <div className="mt-5 flex justify-between border-t pt-4 text-gray-600">
          <div className="flex items-center gap-2">
            <FaBed />
            <span>{listing.bedrooms}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaBath />
            <span>{listing.bathrooms}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaRulerCombined />
            <span>{listing.area} م²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingItem;
