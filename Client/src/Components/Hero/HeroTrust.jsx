import { motion } from "framer-motion";
import { TRUST_INDICATORS } from "../../constants/heroConstants";

/**
 * Quiet row of trust markers. Icon + label only, no pill backgrounds
 * competing with the search card above it — reads as one calm statement.
 * Icons get a soft brighten-on-hover as a micro-interaction.
 */
export default function HeroTrust({ revealed = true }) {
  return (
    <ul
      aria-label="مؤشرات الثقة في المنصة"
      className="flex flex-wrap items-center gap-x-8 gap-y-4"
    >
      {TRUST_INDICATORS.map(({ id, label, icon: Icon }, i) => (
        <motion.li
          key={id}
          initial={revealed ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 + i * 0.06 }}
          whileHover={{ y: -1 }}
          className="group flex items-center gap-2 text-[13px] text-[#F3F1EC]/60"
        >
          <Icon
            size={15}
            strokeWidth={1.75}
            className="text-[#C9A227] transition-colors duration-300 group-hover:text-[#E8C766]"
          />
          <span className="transition-colors duration-300 group-hover:text-[#F3F1EC]/80">
            {label}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}
