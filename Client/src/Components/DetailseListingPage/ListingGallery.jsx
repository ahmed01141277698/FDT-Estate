import { motion } from "framer-motion";
import { ImageOff, Images } from "lucide-react";
import { useState } from "react";
import ImageViewer from "./ImageViewer";

function GalleryImage({ src, alt, className, onClick, priority }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer group ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
}

export default function ListingGallery({ images = [], title }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openViewer = (i) => {
    setActiveIndex(i);
    setViewerOpen(true);
  };

  if (!images.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <div className="h-[300px] md:h-[440px] rounded-3xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-3">
          <ImageOff className="w-10 h-10" strokeWidth={1.5} />
          <span className="text-sm font-medium">
            لا توجد صور متاحة لهذا العقار
          </span>
        </div>
      </div>
    );
  }

  const shown = images.slice(0, 5);
  const extraCount = images.length - 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 md:px-8 pt-6"
    >
      <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm">
        <GalleryImage
          src={shown[0]}
          alt={`${title} - الصورة الرئيسية`}
          priority
          onClick={() => openViewer(0)}
          className="col-span-4 md:col-span-2 row-span-2 rounded-2xl md:rounded-r-3xl"
        />

        {shown.slice(1, 5).map((img, i) => {
          const realIndex = i + 1;
          const isLast = realIndex === 4 && extraCount > 0;
          return (
            <div key={realIndex} className="relative hidden md:block">
              <GalleryImage
                src={img}
                alt={`${title} - صورة ${realIndex + 1}`}
                onClick={() => openViewer(realIndex)}
                className="w-full h-full"
              />
              {isLast && (
                <button
                  onClick={() => openViewer(realIndex)}
                  className="absolute inset-0 bg-black/45 hover:bg-black/55 transition-colors flex items-center justify-center gap-2 text-white font-semibold focus:outline-none"
                >
                  <Images className="w-4 h-4" />
                  {`+${extraCount} صور`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => openViewer(0)}
        className="md:hidden mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl py-2.5"
      >
        <Images className="w-4 h-4" />
        عرض جميع الصور ({images.length})
      </button>

      {viewerOpen && (
        <ImageViewer
          images={images}
          index={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </motion.div>
  );
}
