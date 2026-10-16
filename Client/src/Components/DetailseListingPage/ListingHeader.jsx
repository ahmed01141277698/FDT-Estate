import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("ar-EG");

export default function ListingHeader({ listing }) {
  const {
    name,
    type,
    offer,
    discountPrice,
    price: regularPrice,
    address,
  } = listing;

  const isRent = type === "rent";
  // السعر البارز دايمًا هو اللي العميل هيدفعه فعليًا (بعد الخصم لو موجود عرض)،
  // والسعر الأصلي بيتعرض مشطوب تحته للمقارنة — نفس المنطق زي ما هو، ماتغيرش.
  const price = offer && discountPrice ? discountPrice : regularPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isRent
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isRent ? "للإيجار" : "للبيع"}
        </span>
        {offer && (
          <span className="rounded-full bg-[#c9a227]/10 px-3 py-1 text-xs font-bold text-[#8a7a3f]">
            عرض خاص
          </span>
        )}
      </div>
      <div>
        <span className="font-medium text-[#6b7a74]"> تاريخ النشر: {""}</span>
        <span className="font-medium text-[#6b7a74]">
          {new Date(listing.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      <h1 className="text-2xl font-extrabold leading-snug text-[#183d37] md:text-4xl">
        {name}
      </h1>
      <div className="flex items-center gap-1.5 text-[#6b7a74]">
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="text-sm md:text-base">{address}</span>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex items-end gap-3 pt-1"
      >
        <span className="text-gold-gradient text-3xl font-extrabold md:text-4xl">
          {numberFormatter.format(price)} ج.م
        </span>
        {isRent && (
          <span className="mb-1 text-sm font-medium text-[#8a988f]">
            / شهريًا
          </span>
        )}
        {offer && (
          <span className="mb-1 text-base text-[#8a988f] line-through">
            {numberFormatter.format(regularPrice)}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
