import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, COPY } from "../../constants/heroConstants";
import { useHeroSearch } from "../../hooks/useHeroSearch";
import HeroButtons from "./HeroButtons";
import HeroSearch from "./HeroSearch";
import HeroTrust from "./HeroTrust";
import HeroStats from "./HeroStats";
import HeroVisual from "./HeroVisual";

const EASE = [0.16, 1, 0.3, 1];

function FloatingNav({ isAuthenticated }) {
  const [hovered, setHovered] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return <></>;
}

/**
 * FDT Estate — Hero Section (v2).
 *
 * Native RTL/Arabic. Backend, auth, routes and the Search API are
 * untouched here — `onSearch` is a plain callback stub; wire it to the
 * existing Search API / router / Redux without changing anything below
 * the surface. Structure, palette and component boundaries from v1 are
 * preserved — this pass only deepens motion, depth and content.
 */
export default function Hero({
  onSearch,
  onPrimaryCta,
  onSecondaryCta,
  isAuthenticated = false,
}) {
  const [ready, setReady] = useState(false);
  const search = useHeroSearch(onSearch);

  // Gate the entrance sequence until first paint so SSR/hydration doesn't
  // show a flash of the final state before animating in.
  useEffect(() => setReady(true), []);

  return (
    <section
      id="home"
      dir="rtl"
      lang="ar"
      className="relative overflow-hidden bg-[#090B10] text-[#F3F1EC]"
      style={{
        fontFamily:
          "'IBM Plex Sans Arabic', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* depth layer 1: blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(78,121,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(78,121,255,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* depth layer 2: ambient brass glow, top corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-0 h-[560px] w-[560px] rounded-full
                   bg-[radial-gradient(circle,rgba(201,162,39,0.16),transparent_65%)] blur-2xl"
      />
      {/* depth layer 3: secondary cool glow, opposite corner, for balance */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 end-0 h-[420px] w-[420px] rounded-full
                   bg-[radial-gradient(circle,rgba(78,121,255,0.08),transparent_70%)] blur-2xl"
      />
      {/* depth layer 4: vignette so content stays legible over the glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 60% at 50% 0%, transparent 40%, #090B10 100%)",
        }}
      />
      {/* depth layer 5: film-grain noise for material depth, very low opacity */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02] mix-blend-overlay"
      >
        <filter id="heroFilmGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroFilmGrain)" />
      </svg>

      <FloatingNav isAuthenticated={isAuthenticated} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-10 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* content column — lands on the right in RTL automatically */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.span
              initial={ready ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10
                         bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-[#E8C766]"
            >
              {COPY.eyebrow}
            </motion.span>

            <h1 className="font-display text-[40px] leading-[1.32] sm:text-[48px] lg:text-[54px]">
              <motion.span
                initial={ready ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.65, ease: EASE }}
                className="block font-semibold"
              >
                {COPY.headlineLine1}
              </motion.span>
              <motion.span
                initial={ready ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.8, ease: EASE }}
                className="block font-semibold text-[#C9A227]"
              >
                {COPY.headlineLine2}
              </motion.span>
            </h1>

            <motion.p
              initial={ready ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
              className="mt-5 max-w-md text-[15.5px] leading-[1.9] text-[#F3F1EC]/60"
            >
              {COPY.description}
            </motion.p>

            <motion.div
              initial={ready ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
              className="mt-8"
            >
              <HeroButtons
                onPrimary={onPrimaryCta}
                onSecondary={onSecondaryCta}
              />
            </motion.div>
          </div>

          {/* signature visual — lands on the left in RTL automatically */}
          <div className="lg:col-span-6">
            <HeroVisual activeCityId={search.cityId} revealed={ready} />
          </div>
        </div>

        <div className="mt-14">
          <HeroSearch
            search={search}
            onCityChange={search.setCityId}
            revealed={ready}
          />
        </div>

        <div className="mt-10">
          <HeroTrust revealed={ready} />
        </div>

        <div className="mt-14">
          <HeroStats revealed={ready} />
        </div>
      </div>
    </section>
  );
}
