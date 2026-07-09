import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function Toast({ message, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          dir="rtl"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
