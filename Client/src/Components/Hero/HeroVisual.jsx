import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Activity, MapPin, BedDouble, Ruler } from "lucide-react";
import { CITIES } from "../../constants/HeroConstants";

const VIEWBOX = { w: 400, h: 520 };
const CAIRO = CITIES.find((c) => c.isHub);
const SATELLITES = CITIES.filter((c) => !c.isHub);

// Fixed ambient particle field — generated once, not on every render.
// Positions are deterministic (not Math.random on each render) so the
// field doesn't jump around when the component re-renders on selection.
const PARTICLES = [
  { x: 60, y: 160, r: 1.4, d: 7 },
  { x: 340, y: 120, r: 1.1, d: 9 },
  { x: 180, y: 60, r: 1.6, d: 6 },
  { x: 260, y: 340, r: 1.2, d: 8 },
  { x: 40, y: 320, r: 1.3, d: 10 },
  { x: 360, y: 440, r: 1.1, d: 7 },
  { x: 150, y: 460, r: 1.5, d: 9 },
  { x: 220, y: 180, r: 1.0, d: 11 },
  { x: 320, y: 220, r: 1.3, d: 8 },
  { x: 90, y: 400, r: 1.1, d: 6 },
];

function PropertyPreviewCard({ city }) {
  const { listing } = city;
  return (
    <motion.div
      key={city.id}
      dir="rtl"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-4 right-4 left-4 rounded-2xl border border-white/10
                 bg-[#10141C]/85 backdrop-blur-xl overflow-hidden
                 shadow-[0_20px_50px_-14px_rgba(0,0,0,0.65)]"
    >
      <div className="flex gap-3 p-3.5">
        {/* image placeholder — brand-consistent gradient block, no stock imagery */}
        <div
          className="h-16 w-20 shrink-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,162,39,0.35), rgba(78,121,255,0.12))",
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display text-[14px] font-medium text-[#F3F1EC]">
                {listing.title}
              </p>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#F3F1EC]/45">
                <MapPin size={11} />
                <span className="truncate">{city.name}</span>
              </div>
            </div>
            {listing.verified && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#C9A227]/15 px-2 py-1 text-[10px] text-[#E8C766]">
                <BadgeCheck size={11} />
                عقار موثق
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3 text-[11px] text-[#F3F1EC]/60">
            <span className="flex items-center gap-1">
              <BedDouble size={12} className="text-[#C9A227]" />
              {listing.bedrooms} غرف
            </span>
            <span className="flex items-center gap-1">
              <Ruler size={12} className="text-[#C9A227]" />
              <span dir="ltr">{listing.area}</span> م²
            </span>
            <span
              dir="ltr"
              className="ms-auto font-mono text-[13px] font-medium text-[#E8C766]"
            >
              {listing.priceM}M{" "}
              <span className="font-sans text-[10px] text-[#F3F1EC]/50">
                EGP
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * @param {string|null} activeCityId - id of the city selected in HeroSearch
 * @param {boolean} [revealed] - gates the entrance sequence (Hero story)
 */
export default function HeroVisual({ activeCityId, revealed = true }) {
  const activeCity = useMemo(
    () => CITIES.find((c) => c.id === activeCityId) ?? null,
    [activeCityId],
  );
  const focus = activeCity ?? CAIRO;
  const scale = activeCity ? 1.4 : 1;
  const translateX = (VIEWBOX.w / 2 - focus.x) * (scale - 1) * -0.6;
  const translateY = (VIEWBOX.h / 2 - focus.y) * (scale - 1) * -0.6;

  return (
    <div
      role="img"
      aria-label={
        activeCity
          ? `الخريطة تركّز الآن على ${activeCity.name}`
          : "خريطة توضيحية لتغطية FDT Estate في مصر"
      }
      className="relative aspect-[4/5] w-full max-w-[440px] mx-auto lg:mx-0"
    >
      {/* layer 1: ambient glow */}
      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_60%_35%,rgba(201,162,39,0.14),transparent_60%)]" />

      {/* layer 2: glass frame */}
      <motion.div
        initial={revealed ? { opacity: 0, scale: 0.97 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 rounded-[32px] border border-white/[0.06] bg-white/[0.015] overflow-hidden"
      >
        {/* subtle noise texture for depth */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay"
          aria-hidden
        >
          <filter id="heroNoise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroNoise)" />
        </svg>

        <motion.svg
          viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
          className="h-full w-full"
          animate={{ scale, x: translateX, y: translateY }}
          transition={{ type: "spring", stiffness: 85, damping: 19 }}
          style={{ transformOrigin: "center" }}
        >
          <defs>
            <pattern
              id="blueprintGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#4E79FF"
                strokeOpacity="0.07"
                strokeWidth="1"
              />
            </pattern>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8C766" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E8C766" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect
            width={VIEWBOX.w}
            height={VIEWBOX.h}
            fill="url(#blueprintGrid)"
          />

          {/* ambient particles — slow independent drift, very low opacity */}
          {PARTICLES.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="#F3F1EC"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: [0.1, 0.32, 0.1], cy: [p.y, p.y - 10, p.y] }}
              transition={{
                duration: p.d,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* connectors — soft marching-dash flow, brighter + faster on the active line */}
          {SATELLITES.map((city) => {
            const isActive = city.id === activeCityId;
            return (
              <motion.line
                key={`line-${city.id}`}
                x1={CAIRO.x}
                y1={CAIRO.y}
                x2={city.x}
                y2={city.y}
                stroke={isActive ? "#E8C766" : "#4E79FF"}
                strokeOpacity={isActive ? 0.65 : 0.16}
                strokeWidth={isActive ? 1.4 : 1}
                strokeDasharray="3 5"
                animate={{ strokeDashoffset: [0, -16] }}
                transition={{
                  duration: isActive ? 1.4 : 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}

          {/* city nodes */}
          {CITIES.map((city) => {
            const isActive =
              city.id === activeCityId || (!activeCity && city.isHub);
            const r = city.isHub ? 6 : 4.5;
            return (
              <g key={city.id}>
                {isActive && (
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={r * 4}
                    fill="url(#nodeGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 0.85, 0.5] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                {/* soft idle halo on every node so the whole map reads as "alive" */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={r + 3}
                  fill="#F3F1EC"
                  fillOpacity={isActive ? 0 : 0.05}
                />
                <motion.circle
                  cx={city.x}
                  cy={city.y}
                  r={r}
                  fill={isActive ? "#E8C766" : "#F3F1EC"}
                  fillOpacity={isActive ? 1 : 0.55}
                  animate={
                    isActive
                      ? { r: [r, r + 1.6, r] }
                      : { opacity: [0.55, 0.75, 0.55] }
                  }
                  transition={{
                    duration: isActive ? 2 : 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <text
                  x={city.x}
                  y={city.y - r - 8}
                  textAnchor="middle"
                  fontFamily="'IBM Plex Sans Arabic', sans-serif"
                  fontSize="10"
                  fill={isActive ? "#E8C766" : "#F3F1EC"}
                  fillOpacity={isActive ? 1 : 0.42}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </motion.svg>

        {/* floating glass badges */}
        <motion.div
          initial={revealed ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full
                     border border-white/10 bg-[#10141C]/80 px-3 py-1.5 backdrop-blur-md
                     shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]"
        >
          <BadgeCheck size={13} className="text-[#C9A227]" />
          <span className="text-[11px] font-medium text-[#F3F1EC]/85">
            شبكة موثقة
          </span>
        </motion.div>

        <motion.div
          initial={revealed ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full
                     border border-white/10 bg-[#10141C]/80 px-3 py-1.5 backdrop-blur-md
                     shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]"
        >
          <Activity size={13} className="text-emerald-400" />
          <span className="text-[11px] font-medium text-[#F3F1EC]/85">
            السوق مباشر
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeCity && <PropertyPreviewCard city={activeCity} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
