import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  MessageCircle,
  Phone,
  Heart,
  Send,
  Globe,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import ShareButtons from "./ShareButtons";

// Converts a local Egyptian number (01xxxxxxxxx) or an already-international
// number into the digits-only format WhatsApp's wa.me links expect.
const toWhatsAppNumber = (phone) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return digits;
};

const SOCIAL_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  website: Globe,
};

export default function ContactCard({
  listing,
  owner,
  saved,
  onToggleSave,
  onCopied,
}) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const ownerData = owner || {};

  const whatsappNumber = toWhatsAppNumber(ownerData.phone);
  const socialEntries = Object.entries(ownerData.socialLinks || {}).filter(
    ([, url]) => Boolean(url),
  );

  const handleSendWhatsApp = () => {
    if (!message.trim() || !whatsappNumber) return;
    const intro = `مرحبًا، أنا مهتم بعقار "${listing?.name || ""}" المعروض على مَسكَن.\n\n`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      intro + message.trim(),
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setMessage("");
    setMessageOpen(false);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="h-fit lg:sticky lg:top-24"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#e7e2d7] bg-white/90 shadow-xl shadow-[#183d37]/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#e49263]/8 via-white/40 to-white/0" />

        <div className="relative space-y-5 p-6">
          {/* Owner identity — clickable through to their public profile */}
          <Link
            to={ownerData._id ? `/user/${ownerData._id}` : "#"}
            className="group flex items-center gap-3"
          >
            <img
              src={
                ownerData.avatar?.url ||
                ownerData.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  ownerData.username || "Owner",
                )}&background=183d37&color=fee0c4`
              }
              alt={ownerData.username || "المالك"}
              className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-white transition group-hover:ring-[#e49263]/50"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#183d37] transition group-hover:text-[#e49263]">
                  {ownerData.username || "مالك العقار"}
                </span>
                {ownerData.isVerified && (
                  <BadgeCheck
                    className="h-4 w-4 text-[#c9a227]"
                    fill="currentColor"
                    fillOpacity={0.2}
                  />
                )}
              </div>
              <span className="text-xs font-semibold text-[#a08a5f]">
                {ownerData.isVerified ? "مالك موثّق" : "عرض الملف الشخصي"}
              </span>
            </div>
          </Link>

          {/* Social links — populated once profile social accounts ship */}
          {socialEntries.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socialEntries.map(([platform, url]) => {
                const Icon = SOCIAL_ICONS[platform] || Globe;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#183d37]/5 text-[#183d37] transition hover:bg-[#e49263] hover:text-[#173d36]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          )}

          <div className="space-y-2.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMessageOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e49263] py-3.5 font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/25 transition-colors hover:bg-[#f1b68b]"
            >
              <MessageCircle className="h-4 w-4" />
              إرسال رسالة
            </motion.button>

            <AnimatePresence>
              {messageOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك للمالك..."
                    className="w-full resize-none rounded-xl border border-[#e7e2d7] p-3 text-sm text-[#183d37] outline-none focus:ring-2 focus:ring-[#e49263]/40"
                  />
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    disabled={!message.trim() || !whatsappNumber}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2 text-sm font-bold text-white transition-colors hover:bg-[#1fb958] disabled:cursor-not-allowed disabled:bg-[#e7e2d7] disabled:text-[#a9beb5]"
                  >
                    <Send className="h-4 w-4" />
                    إرسال عبر واتساب
                  </button>
                  {!whatsappNumber && (
                    <p className="mt-1.5 text-xs font-semibold text-[#a9beb5]">
                      رقم المالك غير متاح حاليًا
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href={ownerData.phone ? `tel:${ownerData.phone}` : undefined}
              whileHover={ownerData.phone ? { scale: 1.015 } : undefined}
              whileTap={ownerData.phone ? { scale: 0.98 } : undefined}
              aria-disabled={!ownerData.phone}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-extrabold transition-colors ${
                ownerData.phone
                  ? "bg-[#183d37] text-white hover:bg-[#0f2622]"
                  : "cursor-not-allowed bg-[#e7e2d7] text-[#a9beb5]"
              }`}
            >
              <Phone className="h-4 w-4" />
              اتصال بالمالك
            </motion.a>
          </div>

          <div className="flex items-center justify-between border-t border-[#e7e2d7] pt-1">
            <ShareButtons title={listing.name} onCopied={onCopied} />

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onToggleSave}
              aria-label="حفظ العقار"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#183d37]/5 hover:bg-[#183d37]/10"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  saved ? "text-rose-500" : "text-[#6b7d76]"
                }`}
                fill={saved ? "currentColor" : "none"}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
