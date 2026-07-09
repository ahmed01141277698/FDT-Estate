import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ListingDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setNeedsToggle(textRef.current.scrollHeight > 132);
    }
  }, [description]);

  if (!description) return null;

  return (
    <div className="border-t border-slate-100 pt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">عن العقار</h2>
      <motion.p
        ref={textRef}
        animate={{ height: expanded || !needsToggle ? "auto" : 132 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="text-slate-600 leading-8 overflow-hidden whitespace-pre-line"
      >
        {description}
      </motion.p>

      {needsToggle && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {expanded ? "عرض أقل" : "قراءة المزيد"}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>
      )}
    </div>
  );
}
