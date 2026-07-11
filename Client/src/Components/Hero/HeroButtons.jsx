import { motion } from "framer-motion";
import { ArrowUpLeft, PlayCircle } from "lucide-react";
import { COPY } from "../../constants/heroConstants";

/**
 * Two CTAs: a filled brass primary and a quiet outlined secondary.
 * RTL-native: the "forward" cue points up-left (not up-right), matching
 * Arabic reading direction, and the arrow nudges further on hover.
 */
export default function HeroButtons({ onPrimary, onSecondary }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
      <motion.button
        type="button"
        onClick={onPrimary}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group inline-flex items-center justify-center gap-2 rounded-full
                   bg-gradient-to-b from-[#E8C766] to-[#C9A227]
                   px-7 py-3.5 text-sm font-semibold tracking-wide text-[#100C02]
                   shadow-[0_8px_24px_-8px_rgba(201,162,39,0.55)]
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-[#E8C766]"
      >
        {COPY.ctaPrimary}
        <ArrowUpLeft
          size={16}
          strokeWidth={2.5}
          className="transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </motion.button>

      <motion.button
        type="button"
        onClick={onSecondary}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        className="group inline-flex items-center justify-center gap-2 rounded-full
                   border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-medium
                   text-[#F3F1EC] backdrop-blur-sm transition-colors duration-300
                   hover:border-white/30
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-white/40"
      >
        <PlayCircle size={16} strokeWidth={2} className="text-[#E8C766]" />
        {COPY.ctaSecondary}
      </motion.button>
    </div>
  );
}
