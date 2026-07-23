import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
  Quote,
} from "lucide-react";
import WriteReviewModal from "./Writereviewmodal";
const API_BASE = import.meta.env.VITE_API_URL || "/api";

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="#c9a227" stroke="none" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/reviews?limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (reviews.length < 2) return;
    timerRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(timerRef.current);
  }, [reviews.length]);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  };

  if (loading) {
    return (
      <section
        className="px-4 py-20 text-center md:px-8 lg:px-16"
        style={{ background: "#f8f6f2" }}
      >
        <p className="text-sm font-semibold" style={{ color: "#6b7a74" }}>
          جاري تحميل آراء العملاء...
        </p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section
        className="px-4 py-20 text-center md:px-8 lg:px-16"
        style={{ background: "#f8f6f2" }}
        dir="rtl"
      >
        <p className="mb-2 text-sm font-bold" style={{ color: "#c9a227" }}>
          آراء عملائنا
        </p>
        <h2
          className="text-3xl font-black md:text-4xl"
          style={{ color: "#183d37" }}
        >
          كن أول من يشاركنا رأيه
        </h2>
        <p className="mt-3 text-sm" style={{ color: "#6b7a74" }}>
          لسه مفيش مراجعات منشورة — أول رأي حقيقي هيظهر هنا.
        </p>
      </section>
    );
  }

  const t = reviews[current];
  const avatarSrc =
    t.userRef?.avatar?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(t.userRef?.username || "User")}&background=183d37&color=fff`;

  return (
    <section
      className="relative overflow-hidden px-4 py-20 md:px-8 lg:px-16"
      style={{ background: "#f8f6f2" }}
      dir="rtl"
    >
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)",
          transform: "translate(50%,-50%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-6 text-center"
      >
        <p className="mb-2 text-sm font-bold" style={{ color: "#c9a227" }}>
          آراء عملائنا
        </p>
        <h2
          className="text-3xl font-black md:text-4xl"
          style={{ color: "#183d37" }}
        >
          يثقون في <span className="text-gold-gradient">مَسكَن</span>
        </h2>
      </motion.div>

      {/* متوسط التقييم والعدد الكلي — بيانات حقيقية من الباك إند */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 mb-14 flex items-center justify-center gap-2 text-sm font-bold"
        style={{ color: "#183d37" }}
      >
        <Stars count={Math.round(averageRating)} />
        <span>{averageRating.toFixed(1)}</span>
        <span style={{ color: "#6b7a74" }} className="font-semibold">
          بناءً على {totalReviews.toLocaleString("ar-EG")} تقييم حقيقي
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="relative" style={{ minHeight: 280 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={t._id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm"
              style={{ border: "1px solid rgba(201,162,39,0.2)" }}
            >
              <Quote
                size={28}
                style={{ color: "rgba(201,162,39,0.5)" }}
                className="rotate-180"
              />

              <p
                className="flex-1 text-base leading-relaxed"
                style={{ color: "#3f4d47" }}
              >
                {t.text}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={avatarSrc}
                    alt={t.userRef?.username}
                    className="h-12 w-12 rounded-full object-cover"
                    style={{ border: "2px solid rgba(201,162,39,0.4)" }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold" style={{ color: "#183d37" }}>
                        {t.userRef?.username || "مستخدم"}
                      </span>
                      {t.userRef?.isVerified && (
                        <BadgeCheck size={15} style={{ color: "#10b981" }} />
                      )}
                    </div>
                    <span className="text-xs" style={{ color: "#8a988f" }}>
                      {[t.role, t.city].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                </div>
                <Stars count={t.rating} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        {reviews.length > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                clearInterval(timerRef.current);
                go(-1);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
              style={{ border: "1px solid rgba(201,162,39,0.3)" }}
            >
              <ChevronRight size={18} style={{ color: "#c9a227" }} />
            </motion.button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    clearInterval(timerRef.current);
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    background:
                      i === current
                        ? "linear-gradient(to right,#c9a227,#e8833a)"
                        : "rgba(24,61,55,0.15)",
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                clearInterval(timerRef.current);
                go(1);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
              style={{ border: "1px solid rgba(201,162,39,0.3)" }}
            >
              <ChevronLeft size={18} style={{ color: "#c9a227" }} />
            </motion.button>
          </div>
        )}
        <div className="pt-5   items-center">
          <button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mr-auto rounded-xl  px-4 py-2 text-lg font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
            onClick={() => setShowReviewModal(true)}
          >
            شاركنا رأيك
          </button>

          {showReviewModal && (
            <WriteReviewModal
              onClose={() => setShowReviewModal(false)}
              onSuccess={(review) => console.log("اتحفظ:", review)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
