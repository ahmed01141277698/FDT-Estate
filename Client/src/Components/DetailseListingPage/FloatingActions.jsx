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
            className="w-11 h-11 rounded-full bg-white text-slate-700 shadow-lg shadow-slate-300/50 border border-slate-100 flex items-center justify-center"
          >
            <ArrowUp className="w-4.5 h-4.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onShare}
        aria-label="مشاركة العقار"
        className="w-11 h-11 rounded-full bg-white text-slate-700 shadow-lg shadow-slate-300/50 border border-slate-100 flex items-center justify-center md:hidden"
      >
        <Share2 className="w-4.5 h-4.5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onToggleSave}
        aria-label="حفظ العقار"
        className="w-11 h-11 rounded-full bg-white shadow-lg shadow-slate-300/50 border border-slate-100 flex items-center justify-center md:hidden"
      >
        <Heart
          className={`w-4.5 h-4.5 ${saved ? "text-rose-500" : "text-slate-500"}`}
          fill={saved ? "currentColor" : "none"}
        />
      </motion.button>
    </div>
  );
}
