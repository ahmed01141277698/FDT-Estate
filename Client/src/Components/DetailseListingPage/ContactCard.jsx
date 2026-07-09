import { motion } from "framer-motion";
import { BadgeCheck, MessageCircle, Phone, Heart } from "lucide-react";
import { useState } from "react";
import ShareButtons from "./ShareButtons";

export default function ContactCard({ listing, owner, saved, onToggleSave, onCopied }) {
  const [messageOpen, setMessageOpen] = useState(false);
  const ownerData = owner || {};

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="lg:sticky lg:top-24 h-fit"
    >
      <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white/40 to-white/0 pointer-events-none" />

        <div className="relative p-6 space-y-5">
          <div className="flex items-center gap-3">
            <img
              src={ownerData.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Owner"}
              alt={ownerData.username || "المالك"}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">
                  {ownerData.username || "مالك العقار"}
                </span>
                <BadgeCheck className="w-4 h-4 text-blue-500" fill="currentColor" fillOpacity={0.15} />
              </div>
              <span className="text-xs text-slate-500">مالك موثّق</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMessageOpen((v) => !v)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              إرسال رسالة
            </motion.button>

            {messageOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <textarea
                  rows={3}
                  placeholder="اكتب رسالتك للمالك..."
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                />
                <button className="mt-2 w-full text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-colors">
                  إرسال
                </button>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3.5 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" />
              اتصال بالمالك
            </motion.button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <ShareButtons title={listing.name} onCopied={onCopied} />

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onToggleSave}
              aria-label="حفظ العقار"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center shrink-0"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  saved ? "text-rose-500" : "text-slate-500"
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
