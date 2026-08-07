import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingActions({ saved, onToggleSave, onShare }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="العودة للأعلى"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7e2d7] bg-white text-[#183d37] shadow-lg shadow-[#183d37]/10"
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onShare}
        aria-label="مشاركة العقار"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7e2d7] bg-white text-[#183d37] shadow-lg shadow-[#183d37]/10 md:hidden"
      >
        <Share2 className="h-[18px] w-[18px]" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleSave}
        aria-label="حفظ العقار"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e7e2d7] bg-white shadow-lg shadow-[#183d37]/10 md:hidden"
      >
        <Heart
          className={`h-[18px] w-[18px] ${saved ? "text-rose-500" : "text-[#6b7d76]"}`}
          fill={saved ? "currentColor" : "none"}
        />
      </motion.button>
    </div>
  );
}
