// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Heart,
//   MapPin,
//   BedDouble,
//   Bath,
//   Maximize2,
//   BadgeCheck,
//   Tag,
//   Building2,
//   User,
//   Eye,
// } from "lucide-react";

// const FALLBACK_IMG = "https://placehold.co/800x600?text=No+Image";

// // نسخة من Link تحمل خصائص framer-motion (whileHover/whileTap) على زر التفاصيل.
// const MotionLink = motion(Link);

// export default function PropertyCard({ property = {}, index = 0 }) {
//   const [saved, setSaved] = useState(false);

//   const {
//     _id,
//     name = "شقة فاخرة في قلب المدينة",
//     price = 2500000,
//     discountPrice,
//     offer = false,
//     address = "الرياض، حي النرجس",
//     bedrooms = 4,
//     bathrooms = 3,
//     area = "٣٢٠",
//     type = "sell", // rent | sell — قادم من الـ Listing schema
//     imageUrl,
//     verified = false,
//     featured = false,
//     views = 0,
//     userRef, // مُعبّأ (populated) من الباك إند: { username, avatar, accountType }
//   } = property;

//   const isAgency = userRef?.accountType === "agency";
//   const posterName = userRef?.username || "معلن";

//   const image = imageUrl?.[0]?.url || FALLBACK_IMG;
//   const displayPrice = offer && discountPrice ? discountPrice : price;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{
//         duration: 0.5,
//         delay: index * 0.1,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       whileHover={{ y: -6 }}
//       className="relative flex-shrink-0 overflow-hidden rounded-2xl"
//       style={{
//         background: "rgba(255,255,255,0.04)",
//         border: "1px solid rgba(201,162,39,0.15)",
//         backdropFilter: "blur(20px)",
//         width: 340,
//       }}
//     >
//       {/* Image */}
//       <div className="relative h-52 overflow-hidden">
//         <motion.img
//           src={image}
//           alt={name}
//           className="h-full w-full object-cover"
//           whileHover={{ scale: 1.07 }}
//           transition={{ duration: 0.5 }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//         <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-2">
//           {featured && (
//             <span
//               className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
//               style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
//             >
//               مميز
//             </span>
//           )}

//           <span
//             className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${
//               type === "rent" ? "bg-blue-600" : "bg-emerald-600"
//             }`}
//           >
//             {type === "rent" ? "للإيجار" : "للبيع"}
//           </span>

//           {offer && (
//             <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
//               <Tag size={12} /> عرض
//             </span>
//           )}

//           {verified && (
//             <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white">
//               <BadgeCheck size={12} /> موثّق
//             </span>
//           )}
//         </div>

//         <button
//           onClick={() => setSaved((s) => !s)}
//           className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full transition-all"
//           style={{
//             background: saved ? "rgba(201,162,39,0.9)" : "rgba(0,0,0,0.4)",
//             backdropFilter: "blur(8px)",
//             border: "1px solid rgba(201,162,39,0.3)",
//           }}
//         >
//           <Heart
//             size={16}
//             fill={saved ? "#fff" : "none"}
//             stroke={saved ? "#fff" : "#c9a227"}
//             strokeWidth={2}
//           />
//         </button>

//         <div className="absolute bottom-3 right-3">
//           <span
//             className="rounded-xl px-3 py-1.5 text-sm font-bold"
//             style={{
//               background: "rgba(14,14,22,0.85)",
//               border: "1px solid rgba(201,162,39,0.3)",
//               color: "#e8c56d",
//             }}
//           >
//             <span className="num">{Number(displayPrice).toLocaleString()}</span>{" "}
//             ج.م
//           </span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="space-y-3 p-4">
//         <h3
//           className="line-clamp-1 text-base font-semibold leading-snug"
//           style={{ color: "#f0ede6" }}
//         >
//           {name}
//         </h3>

//         <div className="flex items-center gap-1.5" style={{ color: "#8a8696" }}>
//           <MapPin size={13} style={{ color: "#c9a227" }} />
//           <span className="line-clamp-1 text-sm">{address}</span>
//         </div>

//         <div
//           className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm"
//           style={{
//             background: "rgba(255,255,255,0.04)",
//             border: "1px solid rgba(255,255,255,0.06)",
//           }}
//         >
//           <div
//             className="flex items-center gap-1.5"
//             style={{ color: "#8a8696" }}
//           >
//             <BedDouble size={14} style={{ color: "#c9a227" }} />
//             <span className="num">{bedrooms}</span>
//           </div>
//           <div
//             className="h-4 w-px"
//             style={{ background: "rgba(255,255,255,0.1)" }}
//           />
//           <div
//             className="flex items-center gap-1.5"
//             style={{ color: "#8a8696" }}
//           >
//             <Bath size={14} style={{ color: "#c9a227" }} />
//             <span className="num">{bathrooms}</span>
//           </div>
//           <div
//             className="h-4 w-px"
//             style={{ background: "rgba(255,255,255,0.1)" }}
//           />
//           <div
//             className="flex items-center gap-1.5"
//             style={{ color: "#8a8696" }}
//           >
//             <Maximize2 size={14} style={{ color: "#c9a227" }} />
//             <span className="num">{area}</span> م²
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-1">
//           <div className="flex min-w-0 items-center gap-3">
//             {userRef && (
//               <div
//                 className="flex min-w-0 items-center gap-1.5"
//                 style={{ color: "#8a8696" }}
//               >
//                 {isAgency ? (
//                   <Building2 size={13} style={{ color: "#c9a227" }} />
//                 ) : (
//                   <User size={13} style={{ color: "#c9a227" }} />
//                 )}
//                 <span className="line-clamp-1 text-xs">{posterName}</span>
//               </div>
//             )}

//             <div
//               className="flex shrink-0 items-center gap-1"
//               style={{ color: "#8a8696" }}
//               title={`${views} مشاهدة`}
//             >
//               <Eye size={13} style={{ color: "#c9a227" }} />
//               <span className="num text-xs">{views}</span>
//             </div>
//           </div>

//           <MotionLink
//             to={_id ? `/listing/${_id}` : "#"}
//             whileHover={{ scale: 1.04 }}
//             whileTap={{ scale: 0.97 }}
//             className="mr-auto rounded-xl px-4 py-2 text-xs font-semibold text-white"
//             style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
//           >
//             عرض التفاصيل
//           </MotionLink>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { toggleFavoriteLocal } from "../../../redux/favoriteSlice/favoriteSlice";
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  BadgeCheck,
  Tag,
  Building2,
  User,
  Eye,
} from "lucide-react";

const FALLBACK_IMG = "https://placehold.co/800x600?text=No+Image";

// نسخة من Link تحمل خصائص framer-motion (whileHover/whileTap) على زر التفاصيل.
const MotionLink = motion(Link);

export default function PropertyCard({ property = {}, index = 0 }) {
  const [favoritesCount, setFavoritesCount] = useState(
    property?.favoritesCount || 0,
  );

  const {
    _id,
    name = "شقة فاخرة في قلب المدينة",
    price = 2500000,
    discountPrice,
    offer = false,
    address = "الرياض، حي النرجس",
    bedrooms = 4,
    bathrooms = 3,
    area = "٣٢٠",
    type = "sell", // rent | sell — قادم من الـ Listing schema
    imageUrl,
    verified = false,
    featured = false,
    views = 0,
    userRef, // مُعبّأ (populated) من الباك إند: { username, avatar, accountType }
  } = property;
  const dispatch = useDispatch();

  const saved = useSelector((state) =>
    state.favorites.favoritesIds.includes(_id),
  );
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isAgency = userRef?.accountType === "agency";
  const posterName = userRef?.username || "معلن";

  const image = imageUrl?.[0]?.url || FALLBACK_IMG;
  const displayPrice = offer && discountPrice ? discountPrice : price;

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate("/signin");
      return;
    }
    dispatch(toggleFavoriteLocal(_id));

    const previousCount = favoritesCount;

    setFavoritesCount((prev) => (saved ? Math.max(prev - 1, 0) : prev + 1));

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/listing/favorites/${_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(toggleFavoriteLocal(_id));
        setFavoritesCount(previousCount);
      }
    } catch (error) {
      dispatch(toggleFavoriteLocal(_id));
      setFavoritesCount(previousCount);
      console.log(error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-[#e7e2d7] bg-white shadow-sm transition-shadow hover:shadow-lg"
      style={{ width: 340 }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-2">
          {featured && (
            <span className="rounded-full bg-gradient-to-r from-[#e8c56d] to-[#c9a227] px-2.5 py-1 text-xs font-extrabold text-[#173d36]">
              مميز
            </span>
          )}

          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
              type === "rent"
                ? "bg-[#e49263] text-[#173d36]"
                : "bg-[#183d37] text-white"
            }`}
          >
            {type === "rent" ? "للإيجار" : "للبيع"}
          </span>

          {offer && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e8c56d] to-[#c9a227] px-2.5 py-1 text-xs font-extrabold text-[#173d36]">
              <Tag size={12} /> عرض
            </span>
          )}

          {verified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-extrabold text-white">
              <BadgeCheck size={12} /> موثّق
            </span>
          )}
        </div>

        <button
          onClick={handleFavorite}
          aria-label="حفظ العقار"
          className={`absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
            saved
              ? "border-rose-400 bg-rose-500"
              : "border-white/40 bg-black/35"
          }`}
        >
          <Heart
            size={16}
            fill={saved ? "#fff" : "none"}
            stroke="#fff"
            strokeWidth={2}
          />
        </button>

        <div className="absolute bottom-3 right-3">
          <span className="rounded-xl border border-[#e8c56d]/30 bg-[#0f2622]/85 px-3 py-1.5 text-sm font-bold text-[#e8c56d]">
            <span className="num">{Number(displayPrice).toLocaleString()}</span>{" "}
            ج.م
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 text-base font-black leading-snug text-[#183d37]">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 text-[#6b7d76]">
          <MapPin size={13} className="text-[#e49263]" />
          <span className="line-clamp-1 text-sm font-semibold">{address}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[#e7e2d7] bg-[#faf9f6] px-3 py-2.5 text-sm">
          <div className="flex items-center gap-1.5 text-[#183d37]">
            <BedDouble size={14} className="text-[#e49263]" />
            <span className="num font-bold">{bedrooms}</span>
          </div>
          <div className="h-4 w-px bg-[#e7e2d7]" />
          <div className="flex items-center gap-1.5 text-[#183d37]">
            <Bath size={14} className="text-[#e49263]" />
            <span className="num font-bold">{bathrooms}</span>
          </div>
          <div className="h-4 w-px bg-[#e7e2d7]" />
          <div className="flex items-center gap-1.5 text-[#183d37]">
            <Maximize2 size={14} className="text-[#e49263]" />
            <span className="num font-bold">{area}</span> م²
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex min-w-0 items-center gap-2">
            {userRef && (
              <div className="flex min-w-0 items-center gap-1.5 text-[#a08a5f]">
                {isAgency ? (
                  <Building2 size={13} className="text-[#e49263]" />
                ) : (
                  <User size={13} className="text-[#e49263]" />
                )}
                <span className="line-clamp-1 text-xs font-semibold">
                  {posterName}
                </span>
              </div>
            )}

            <div className="flex shrink-0 items-center gap-3">
              <div
                className="flex items-center gap-1 text-[#a08a5f]"
                title={`${views} مشاهدة`}
              >
                <Eye size={13} className="text-[#e49263]" />
                <span className="num text-xs font-semibold">{views}</span>
              </div>

              <div
                className="flex items-center gap-1 text-[#a08a5f]"
                title={`${favoritesCount} حفظ`}
              >
                <Heart size={13} className="text-[#e49263]" />
                <span className="num text-xs font-semibold">
                  {favoritesCount}
                </span>
              </div>
            </div>
          </div>

          <MotionLink
            to={_id ? `/listing/${_id}` : "#"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mr-auto rounded-xl bg-[#e49263] px-4 py-2  text-xs font-extrabold text-[#173d36] transition-colors hover:bg-[#f1b68b]"
          >
            عرض التفاصيل
          </MotionLink>
        </div>
      </div>
    </motion.div>
  );
}
