import { motion } from "framer-motion";
import { Link2, Share2 } from "lucide-react";

const CHANNELS = [
  {
    key: "whatsapp",
    label: "واتساب",
    color: "bg-[#25D366]",
    url: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
  },
  {
    key: "facebook",
    label: "فيسبوك",
    color: "bg-[#1877F2]",
    url: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "twitter",
    label: "X",
    color: "bg-slate-900",
    url: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title,
      )}&url=${encodeURIComponent(url)}`,
  },
  {
    key: "telegram",
    label: "تيليجرام",
    color: "bg-[#26A5E4]",
    url: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(title)}`,
  },
];

export default function ShareButtons({ title, onCopied }) {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        return;
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    onCopied?.();
  };

  return (
    <div dir="rtl" className="flex flex-wrap items-center gap-2">
      {typeof navigator !== "undefined" && navigator.share && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 rounded-full bg-[#183d37]/5 px-3.5 py-2 text-xs font-bold text-[#183d37] transition-colors hover:bg-[#183d37]/10"
        >
          <Share2 className="h-3.5 w-3.5" />
          مشاركة
        </motion.button>
      )}

      {CHANNELS.map((c) => (
        <motion.a
          key={c.key}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href={c.url(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${c.color} text-[11px] font-bold text-white`}
          aria-label={c.label}
        >
          {c.label.slice(0, 1)}
        </motion.a>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-full bg-[#183d37]/5 px-3.5 py-2 text-xs font-bold text-[#183d37] transition-colors hover:bg-[#183d37]/10"
      >
        <Link2 className="h-3.5 w-3.5" />
        نسخ الرابط
      </motion.button>
    </div>
  );
}
