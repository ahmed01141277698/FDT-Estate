import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Sofa,
  CarFront,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("ar-EG");

export default function ListingPreviewModal({
  form,
  imagePreviews,
  posterName,
  onClose,
}) {
  const isRent = form.type === "rent";
  const price =
    form.offer && form.discountPrice ? form.discountPrice : form.price;

  return (
    <AnimatePresence>
      <motion.div
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
          {/* شريط علوي واضح إن ده معاينة مش الإعلان الحقيقي */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
            style={{ background: "#183d37" }}
          >
            <span className="text-sm font-bold text-white">
              معاينة الإعلان — كده هيبان للزوار بعد النشر
            </span>
            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>

          {/* الصور */}
          {imagePreviews.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto p-3">
              {imagePreviews.map((img, i) => (
                <div
                  key={i}
                  className="relative h-48 w-64 flex-shrink-0 overflow-hidden rounded-2xl"
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute right-2 top-2 rounded-full bg-[#183d37] px-3 py-1 text-xs font-bold text-white">
                      الرئيسية
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="m-3 flex h-48 items-center justify-center rounded-2xl bg-[#f8f6f2] text-sm font-semibold text-[#8a988f]">
              لسه مفيش صور مختارة
            </div>
          )}

          <div className="space-y-5 px-6 pb-6">
            {/* البادچات */}
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
              {form.category && (
                <span className="rounded-full bg-[#f8f6f2] px-3 py-1 text-xs font-bold text-[#183d37]">
                  {form.category}
                </span>
              )}
              {form.offer && (
                <span className="rounded-full bg-[#c9a227]/10 px-3 py-1 text-xs font-bold text-[#8a7a3f]">
                  عرض خاص
                </span>
              )}
            </div>

            {/* الاسم */}
            <h2 className="text-2xl font-black leading-snug text-[#183d37] md:text-3xl">
              {form.name || "اسم العقار هيظهر هنا"}
            </h2>

            {/* العنوان */}
            <div className="flex items-center gap-1.5 text-[#6b7a74]">
              <MapPin size={16} className="shrink-0" />
              <span className="text-sm md:text-base">
                {form.address || "عنوان العقار هيظهر هنا"}
              </span>
            </div>

            {/* السعر */}
            <div className="flex items-end gap-3">
              <span className="text-gold-gradient text-3xl font-extrabold">
                {price ? numberFormatter.format(price) : "٠"} ج.م
              </span>
              {isRent && (
                <span className="mb-1 text-sm font-medium text-[#8a988f]">
                  / شهريًا
                </span>
              )}
              {form.offer && form.price && (
                <span className="mb-1 text-base text-[#8a988f] line-through">
                  {numberFormatter.format(form.price)}
                </span>
              )}
            </div>

            {/* التفاصيل */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm"
              style={{ background: "#f8f6f2" }}
            >
              <div className="flex items-center gap-1.5 text-[#183d37]">
                <BedDouble size={16} className="text-[#c9a227]" />
                <span>{form.bedrooms || 0} غرف</span>
              </div>
              <div className="h-4 w-px bg-[#183d37]/10" />
              <div className="flex items-center gap-1.5 text-[#183d37]">
                <Bath size={16} className="text-[#c9a227]" />
                <span>{form.bathrooms || 0} حمامات</span>
              </div>
              <div className="h-4 w-px bg-[#183d37]/10" />
              <div className="flex items-center gap-1.5 text-[#183d37]">
                <Ruler size={16} className="text-[#c9a227]" />
                <span>{form.area || 0} م²</span>
              </div>
            </div>

            {/* المميزات */}
            {(form.furnished || form.parking) && (
              <div className="flex flex-wrap gap-2">
                {form.furnished && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#f8f6f2] px-3 py-1.5 text-xs font-bold text-[#183d37]">
                    <Sofa size={14} className="text-[#c9a227]" /> مفروش
                  </span>
                )}
                {form.parking && (
                  <span className="flex items-center gap-1.5 rounded-full bg-[#f8f6f2] px-3 py-1.5 text-xs font-bold text-[#183d37]">
                    <CarFront size={14} className="text-[#c9a227]" /> موقف
                    سيارات
                  </span>
                )}
              </div>
            )}

            {/* الوصف */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-[#183d37]">الوصف</h3>
              <p className="whitespace-pre-line text-sm leading-7 text-[#3f4d47]">
                {form.description || "وصف العقار هيظهر هنا."}
              </p>
            </div>

            {/* صاحب الإعلان */}
            {posterName && (
              <div
                className="border-t pt-4 text-xs text-[#8a988f]"
                style={{ borderColor: "rgba(24,61,55,0.08)" }}
              >
                بواسطة:{" "}
                <span className="font-bold text-[#183d37]">{posterName}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full rounded-xl py-3 text-sm font-extrabold text-[#183d37]"
              style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
            >
              تمام، ارجعني للفورم
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
