import { motion } from "framer-motion";
import { BedDouble, Bath, MapPin } from "lucide-react";

const DUMMY_LISTINGS = [
  {
    _id: "1",
    name: "شقة فاخرة بإطلالة على النيل",
    address: "الزمالك، القاهرة",
    regularPrice: 3200000,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  },
  {
    _id: "2",
    name: "فيلا عصرية بحديقة خاصة",
    address: "الشيخ زايد، الجيزة",
    regularPrice: 5400000,
    bedrooms: 4,
    bathrooms: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    _id: "3",
    name: "شقة أنيقة قريبة من الخدمات",
    address: "مدينة نصر، القاهرة",
    regularPrice: 1850000,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
  {
    _id: "4",
    name: "بنتهاوس بتشطيب سوبر لوكس",
    address: "التجمع الخامس، القاهرة",
    regularPrice: 4700000,
    bedrooms: 3,
    bathrooms: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
];

const numberFormatter = new Intl.NumberFormat("ar-EG");

function RelatedCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="min-w-[260px] md:min-w-[280px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-shadow shrink-0"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{item.address}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" /> {item.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" /> {item.bathrooms}
          </span>
        </div>
        <div className="font-extrabold text-blue-600 text-base pt-1">
          {numberFormatter.format(item.regularPrice)} ج.م
        </div>
      </div>
    </motion.div>
  );
}

export default function RelatedListings() {
  return (
    <div className="border-t border-slate-100 pt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">عقارات مشابهة</h2>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
        {DUMMY_LISTINGS.map((item, i) => (
          <RelatedCard key={item._id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
