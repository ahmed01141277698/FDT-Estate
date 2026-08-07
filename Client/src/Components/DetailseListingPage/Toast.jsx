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
          className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#183d37] px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-[#0f2622]/40"
        >
          <CheckCircle2 className="h-4 w-4 text-[#e8c56d]" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
