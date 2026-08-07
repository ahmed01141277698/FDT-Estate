// import { motion } from "framer-motion";
// import { MapPin, Navigation } from "lucide-react";

// export default function ListingLocation({ address }) {
//   if (!address) return null;

//   return (
//     <div className="border-t border-slate-100 pt-8">
//       <h2 className="text-xl font-bold text-slate-900 mb-4">الموقع</h2>
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.3 }}
//         transition={{ duration: 0.4 }}
//         className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
//       >
//         <div className="relative h-56 md:h-72 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
//           <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_1px_1px,_#cbd5e1_1px,_transparent_0)] bg-[length:22px_22px]" />
//           <motion.div
//             initial={{ scale: 0 }}
//             whileInView={{ scale: 1 }}
//             viewport={{ once: true }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 12,
//               delay: 0.15,
//             }}
//             className="relative w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30"
//           >
//             <MapPin className="w-6 h-6 text-white" fill="currentColor" />
//           </motion.div>
//           <span className="absolute bottom-3 left-3 text-[11px] font-medium text-slate-400 bg-white/70 backdrop-blur px-2 py-1 rounded-md">
//             الخريطة التفاعلية قريبًا
//           </span>
//         </div>

//         <div className="flex items-center justify-between gap-3 bg-white px-5 py-4">
//           <div className="flex items-center gap-2 text-slate-700 text-sm">
//             <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
//             {address}
//           </div>
//           <a
//             href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//               address,
//             )}`}
//             target="_blank"
//             rel="noreferrer"
//             className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0"
//           >
//             <Navigation className="w-3.5 h-3.5" />
//             فتح في الخرائط
//           </a>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Loader2 } from "lucide-react";

// Custom brand-colored pin — avoids the classic broken-marker-icon issue
// Leaflet has with bundlers like Vite/Webpack.
const pinIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:34px;height:42px;">
      <svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 6px 8px rgba(15,38,34,0.35));">
        <path d="M17 0C7.6 0 0 7.6 0 17c0 12.7 17 25 17 25s17-12.3 17-25C34 7.6 26.4 0 17 0z" fill="#e49263"/>
        <circle cx="17" cy="17" r="7" fill="#173d36"/>
      </svg>
    </div>
  `,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -38],
});

export default function ListingLocation({ address }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!address?.trim()) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const geocode = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            address,
          )}`,
        );
        const data = await res.json();
        if (cancelled) return;

        if (data?.[0]) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    geocode();
    return () => {
      cancelled = true;
    };
  }, [address]);

  if (!address) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  return (
    <div className="border-t border-[#e7e2d7] pt-8">
      <h2 className="mb-4 text-xl font-black text-[#183d37]">الموقع</h2>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-[#e7e2d7] shadow-sm"
      >
        {status === "loading" && (
          <div className="flex h-56 flex-col items-center justify-center gap-2 bg-[#faf9f6] text-[#a08a5f] md:h-72">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-semibold">جارٍ تحديد الموقع...</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex h-56 flex-col items-center justify-center gap-2 bg-[#faf9f6] px-6 text-center text-[#a08a5f] md:h-72">
            <MapPin className="h-8 w-8" />
            <span className="text-sm font-semibold">
              تعذّر تحديد الموقع تلقائيًا على الخريطة
            </span>
          </div>
        )}

        {status === "success" && coords && (
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ width: "100%" }}
            className="h-56 md:h-72"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.lat, coords.lng]} icon={pinIcon}>
              <Popup>{address}</Popup>
            </Marker>
          </MapContainer>
        )}

        <div className="flex items-center justify-between gap-3 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#183d37]">
            <MapPin className="h-4 w-4 shrink-0 text-[#e49263]" />
            {address}
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#e49263] hover:text-[#c9763f]"
          >
            <Navigation className="h-3.5 w-3.5" />
            فتح في الخرائط
          </a>
        </div>
      </motion.div>
    </div>
  );
}
