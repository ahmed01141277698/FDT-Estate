import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useCallback } from "react";

export default function ImageViewer({ images, index, onClose, onChange }) {
  const goNext = useCallback(
    () => onChange((index + 1) % images.length),
    [index, images.length, onChange],
  );
  const goPrev = useCallback(
    () => onChange((index - 1 + images.length) % images.length),
    [index, images.length, onChange],
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrev, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      >
        <button
          aria-label="إغلاق"
          onClick={onClose}
          className="absolute top-5 left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="absolute top-6 right-6 text-white/70 text-sm font-medium tracking-wide">
          {index + 1} / {images.length}
        </span>

        <button
          aria-label="الصورة السابقة"
          onClick={goPrev}
          className="absolute right-4 md:right-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          aria-label="الصورة التالية"
          onClick={goNext}
          className="absolute left-4 md:left-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt={`صورة العقار ${index + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
