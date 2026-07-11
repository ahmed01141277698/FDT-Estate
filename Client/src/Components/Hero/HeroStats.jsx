import { motion } from "framer-motion";
import { HERO_STATS } from "../../constants/heroConstants";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";

function StatItem({ value, suffix, label, delay, revealDelay }) {
  const { ref, value: animated } = useAnimatedCounter(value, {
    duration: 1200 + delay,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: revealDelay }}
      className="flex flex-col gap-1"
    >
      {/* numerals stay LTR inside the RTL flow to avoid bidi artifacts */}
      <span
        dir="ltr"
        className="font-mono text-[26px] sm:text-[30px] font-medium tabular-nums text-[#F3F1EC]"
      >
        {animated.toLocaleString()}
        <span className="text-[#C9A227]">{suffix}</span>
      </span>
      <span className="text-[12px] text-[#F3F1EC]/45">{label}</span>
    </motion.div>
  );
}

/**
 * Data-forward, mono-numeral stats — deliberately plain so the numbers
 * carry the "real scale, real inventory" signal without extra ornament.
 */
export default function HeroStats({ revealed = true }) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-t border-white/[0.08] pt-8">
      {HERO_STATS.map((stat, i) => (
        <StatItem
          key={stat.id}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          delay={i * 120}
          revealDelay={revealed ? 1.7 + i * 0.08 : 0}
        />
      ))}
    </dl>
  );
}
