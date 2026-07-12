import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BadgeCheck, ChevronRight, ChevronLeft, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "أحمد المالكي",
    profession: "مدير تنفيذي",
    city: "الرياض",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    verified: true,
    text: "وجدت فيلا أحلامي عبر FDT Estate في أقل من أسبوع. التجربة كانت سلسة واحترافية بشكل لافت، والوكيل كان على مستوى عالٍ من المهنية.",
  },
  {
    id: 2,
    name: "نورة السعيد",
    profession: "طبيبة",
    city: "جدة",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    verified: true,
    text: "المنصة سهلة الاستخدام وتعطيك شعوراً بالثقة. كل التفاصيل واضحة والصور احترافية. استثمرت في شقة وكان القرار صائباً.",
  },
  {
    id: 3,
    name: "خالد الزهراني",
    profession: "رجل أعمال",
    city: "الدمام",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    verified: true,
    text: "أفضل منصة عقارية في المملكة بلا منازع. الدعم الفني ممتاز وخيارات البحث دقيقة جداً. وفّرت عليّ وقتاً وجهداً كبيرين.",
  },
  {
    id: 4,
    name: "سارة الحربي",
    profession: "مهندسة معمارية",
    city: "مكة المكرمة",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 5,
    verified: false,
    text: "تصفح العقارات ممتع وسريع، والمعلومات دقيقة ومحدثة. أنصح كل من يبحث عن عقار بالاعتماد على هذه المنصة.",
  },
];

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
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(c => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const t = TESTIMONIALS[current];

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden" dir="rtl">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 70%)", transform: "translate(50%,-50%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm font-medium mb-2" style={{ color: "#c9a227" }}>آراء عملائنا</p>
        <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#f0ede6" }}>
          يثقون في <span className="text-gold-gradient">FDT Estate</span>
        </h2>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {/* Main card */}
        <div className="relative" style={{ minHeight: 280 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={t.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-3xl p-8 flex flex-col gap-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,162,39,0.18)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* Quote icon */}
              <Quote size={28} style={{ color: "rgba(201,162,39,0.4)" }} className="rotate-180" />

              <p className="text-base leading-relaxed flex-1" style={{ color: "#c8c3bc" }}>{t.text}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: "2px solid rgba(201,162,39,0.4)" }} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold" style={{ color: "#f0ede6" }}>{t.name}</span>
                      {t.verified && <BadgeCheck size={15} style={{ color: "#10b981" }} />}
                    </div>
                    <span className="text-xs" style={{ color: "#8a8696" }}>{t.profession} · {t.city}</span>
                  </div>
                </div>
                <Stars count={t.rating} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { clearInterval(timerRef.current); go(-1); }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,162,39,0.2)" }}>
            <ChevronRight size={18} style={{ color: "#c9a227" }} />
          </motion.button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => { clearInterval(timerRef.current); setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className="transition-all rounded-full"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  background: i === current ? "linear-gradient(to right,#c9a227,#e8833a)" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { clearInterval(timerRef.current); go(1); }}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,162,39,0.2)" }}>
            <ChevronLeft size={18} style={{ color: "#c9a227" }} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
