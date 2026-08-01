import { motion } from "framer-motion";
import { ImageOff, Images } from "lucide-react";
import { useState } from "react";
import ImageViewer from "./ImageViewer";

function GalleryImage({ src, alt, className, onClick, priority }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden ring-1 ring-inset ring-[#c9a227]/0 transition-shadow duration-300 hover:ring-[#c9a227]/40 ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-[#eee9df]" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
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
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
        <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-3xl bg-[#f8f6f2] text-[#8a988f] md:h-[440px]">
          <ImageOff className="h-10 w-10" strokeWidth={1.5} />
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
      className="mx-auto max-w-7xl px-4 pt-6 md:px-8"
    >
      <div className="grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl shadow-sm md:h-[500px] md:gap-3">
        <GalleryImage
          src={shown[0]}
          alt={`${title} - الصورة الرئيسية`}
          priority
          onClick={() => openViewer(0)}
          className="col-span-4 row-span-2 rounded-2xl md:col-span-2 md:rounded-r-3xl"
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
                className="h-full w-full"
              />
              {isLast && (
                <button
                  onClick={() => openViewer(realIndex)}
                  className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 font-semibold text-white transition-colors hover:bg-black/55 focus:outline-none"
                >
                  <Images className="h-4 w-4 text-[#f1b184]" />
                  {`+${extraCount} صور`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => openViewer(0)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#183d37]/10 bg-[#f8f6f2] py-2.5 text-sm font-bold text-[#183d37] transition hover:border-[#c9a227]/40 md:hidden"
      >
        <Images className="h-4 w-4 text-[#c9a227]" />
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
