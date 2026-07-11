import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, ChevronDown, MapPin } from "lucide-react";
import {
  CITIES,
  PROPERTY_TYPES,
  BUDGET_RANGES,
  AI_SEARCH_EXAMPLES,
} from "../../constants/heroConstants";

function Dropdown({ label, icon: Icon, value, options, onSelect, getLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-[150px]">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.045)" }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-right
                   transition-colors focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-[#E8C766]"
      >
        <Icon size={16} className="shrink-0 text-[#C9A227]" />
        <span className="flex-1 min-w-0 truncate">
          <span className="block text-[10px] text-[#F3F1EC]/40">{label}</span>
          <span className="block text-[13px] text-[#F3F1EC] truncate">
            {value ? getLabel(value) : "أي منطقة"}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={14} className="text-[#F3F1EC]/40" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute z-20 mt-2 w-full min-w-[190px] overflow-hidden rounded-xl
                       border border-white/10 bg-[#12161F] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]"
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  onSelect(null);
                  setOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-right text-[13px] text-[#F3F1EC]/60 hover:bg-white/[0.05]"
              >
                أي منطقة
              </button>
            </li>
            {options.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(opt.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-right text-[13px]
                             text-[#F3F1EC] hover:bg-white/[0.05]"
                >
                  {opt.icon && (
                    <opt.icon size={14} className="text-[#C9A227]" />
                  )}
                  {getLabel(opt)}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ZenAiHint() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % AI_SEARCH_EXAMPLES.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-3 flex items-center gap-1.5 px-1 text-[11px] text-[#F3F1EC]/35">
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={11} className="text-[#C9A227]/80" />
      </motion.span>
      <span>اسأل بطريقتك الطبيعية —</span>
      <span
        className="relative inline-block h-4 overflow-hidden align-middle"
        style={{ minWidth: 220 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 whitespace-nowrap text-[#F3F1EC]/55"
          >
            "{AI_SEARCH_EXAMPLES[index]}"
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mr-auto text-[#F3F1EC]/30">مدعوم بـ Zen AI</span>
    </div>
  );
}

/**
 * The one Smart Search of the Hero. Buy/Rent segmented control, three
 * dropdowns, and a brass search button — all RTL-native. `onCityChange`
 * lifts the selected city up to Hero so HeroVisual can react (the
 * cinematic focus). Zen AI is surfaced as a quiet, rotating hint.
 */
export default function HeroSearch({ search, onCityChange, revealed = true }) {
  const [focused, setFocused] = useState(false);
  const {
    mode,
    setMode,
    cityId,
    propertyTypeId,
    setPropertyTypeId,
    budgetId,
    setBudgetId,
    setCityId,
    submit,
  } = search;

  const handleCitySelect = (id) => {
    setCityId(id);
    onCityChange?.(id);
  };

  return (
    <motion.div
      initial={revealed ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      className="rounded-2xl border p-3 sm:p-4 backdrop-blur-xl transition-shadow duration-500"
      style={{
        borderColor: focused
          ? "rgba(232,199,102,0.45)"
          : "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(16,20,28,0.7)",
        boxShadow: focused
          ? "0 0 0 4px rgba(201,162,39,0.12), 0 24px 60px -20px rgba(0,0,0,0.7)"
          : "0 24px 60px -20px rgba(0,0,0,0.7)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div
          role="tablist"
          aria-label="شراء أو إيجار"
          className="flex shrink-0 gap-1 rounded-xl bg-white/[0.04] p-1"
        >
          {[
            { id: "buy", label: "شراء" },
            { id: "rent", label: "إيجار" },
          ].map((m) => (
            <button
              key={m.id}
              role="tab"
              type="button"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className="relative rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
            >
              {mode === m.id && (
                <motion.span
                  layoutId="modeIndicator"
                  className="absolute inset-0 rounded-lg bg-[#E8C766]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 ${mode === m.id ? "text-[#100C02]" : "text-[#F3F1EC]/60"}`}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden lg:block h-9 w-px bg-white/[0.08]" />

        <Dropdown
          label="الموقع"
          icon={MapPin}
          value={cityId}
          options={CITIES}
          onSelect={handleCitySelect}
          getLabel={(c) =>
            typeof c === "string"
              ? CITIES.find((x) => x.id === c)?.name
              : c.name
          }
        />
        <div className="hidden lg:block h-9 w-px bg-white/[0.08]" />

        <Dropdown
          label="نوع العقار"
          icon={Search}
          value={propertyTypeId}
          options={PROPERTY_TYPES}
          onSelect={setPropertyTypeId}
          getLabel={(t) =>
            typeof t === "string"
              ? PROPERTY_TYPES.find((x) => x.id === t)?.label
              : t.label
          }
        />
        <div className="hidden lg:block h-9 w-px bg-white/[0.08]" />

        <Dropdown
          label="الميزانية"
          icon={Sparkles}
          value={budgetId}
          options={BUDGET_RANGES}
          onSelect={setBudgetId}
          getLabel={(b) =>
            typeof b === "string"
              ? BUDGET_RANGES.find((x) => x.id === b)?.label
              : b.label
          }
        />

        <motion.button
          type="button"
          onClick={submit}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl
                     bg-gradient-to-b from-[#E8C766] to-[#C9A227] px-6 py-3.5
                     text-[13px] font-semibold text-[#100C02]
                     focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-offset-2 focus-visible:outline-[#E8C766]"
        >
          <Search size={15} strokeWidth={2.5} />
          بحث
        </motion.button>
      </div>

      <ZenAiHint />
    </motion.div>
  );
}
