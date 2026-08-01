// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronLeft, ChevronRight, X } from "lucide-react";
// import { useEffect, useCallback } from "react";

// export default function ImageViewer({ images, index, onClose, onChange }) {
//   const goNext = useCallback(
//     () => onChange((index + 1) % images.length),
//     [index, images.length, onChange],
//   );
//   const goPrev = useCallback(
//     () => onChange((index - 1 + images.length) % images.length),
//     [index, images.length, onChange],
//   );

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft") goPrev();
//       if (e.key === "ArrowRight") goNext();
//     };
//     window.addEventListener("keydown", handleKey);
//     document.body.style.overflow = "hidden";
//     return () => {
//       window.removeEventListener("keydown", handleKey);
//       document.body.style.overflow = "";
//     };
//   }, [goNext, goPrev, onClose]);

//   return (
//     <AnimatePresence>
//       <motion.div
//         dir="rtl"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
//       >
//         <button
//           aria-label="إغلاق"
//           onClick={onClose}
//           className="absolute top-5 left-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <span className="absolute top-6 right-6 text-white/70 text-sm font-medium tracking-wide">
//           {index + 1} / {images.length}
//         </span>

//         <button
//           aria-label="الصورة السابقة"
//           onClick={goPrev}
//           className="absolute right-4 md:right-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
//         >
//           <ChevronRight className="w-6 h-6" />
//         </button>

//         <button
//           aria-label="الصورة التالية"
//           onClick={goNext}
//           className="absolute left-4 md:left-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
//         >
//           <ChevronLeft className="w-6 h-6" />
//         </button>

//         <AnimatePresence mode="wait">
//           <motion.img
//             key={index}
//             src={images[index]}
//             alt={`صورة العقار ${index + 1}`}
//             initial={{ opacity: 0, scale: 0.96 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.96 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//             className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
//           />
//         </AnimatePresence>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useCallback } from "react";

export default function ImageViewer({ images, index, onClose, onChange }) {
  const goNext = useCallback(
    () => onChange((index + 1) % images.length),
    [index, images.length, onChange],
  );
  const goPrev = useCallback(
    () => onChange((index - 1 + images.length) % images.length),
    [index, images.length, onChange],
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrev, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
      >
        {/* لمسة هوية خفيفة — توهج دهبي في أطراف الشاشة، من غير ما يلهي عن الصورة */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(201,162,39,0.06) 0%, transparent 55%)",
          }}
        />

        <button
          aria-label="إغلاق"
          onClick={onClose}
          className="absolute top-5 left-5 rounded-full border border-white/10 bg-white/10 p-2.5 text-white/80 transition-colors hover:border-[#c9a227]/40 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]/50"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="absolute top-6 right-6 rounded-full border border-[#c9a227]/25 bg-white/5 px-3 py-1.5 text-sm font-semibold tracking-wide text-[#e8c56d]">
          <span className="num">{index + 1}</span> /{" "}
          <span className="num">{images.length}</span>
        </span>

        <button
          aria-label="الصورة السابقة"
          onClick={goPrev}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white/80 transition-colors hover:border-[#c9a227]/40 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]/50 md:right-8"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <button
          aria-label="الصورة التالية"
          onClick={goNext}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white/80 transition-colors hover:border-[#c9a227]/40 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#c9a227]/50 md:left-8"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt={`صورة العقار ${index + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-[0_0_60px_rgba(201,162,39,0.08)]"
          />
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
