import { motion } from "framer-motion";
import { HomeIcon, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorState({ message }) {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-6"
      >
        <SearchX className="w-12 h-12 text-slate-400" strokeWidth={1.5} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-2xl md:text-3xl font-bold text-slate-800 mb-2"
      >
        العقار غير موجود
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-slate-500 mb-8 max-w-sm"
      >
        {message || "يبدو أن هذا العقار تم حذفه أو أن الرابط غير صحيح."}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-colors"
      >
        <HomeIcon className="w-4 h-4" />
        العودة للرئيسية
      </motion.button>
    </div>
  );
}
