import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Phone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden" dir="rtl">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,131,58,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(232,131,58,0.08) 50%, rgba(201,162,39,0.06) 100%)",
          border: "1px solid rgba(201,162,39,0.25)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Glow lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% -20%, rgba(201,162,39,0.2) 0%, transparent 60%)",
          }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
        >
          <Sparkles size={28} color="#fff" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: "#f0ede6" }}
        >
          ابدأ رحلتك العقارية <br />
          <span className="text-gold-gradient">معنا اليوم</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg mb-10 max-w-lg mx-auto"
          style={{ color: "#8a8696" }}
        >
          انضم إلى أكثر من <span className="num font-bold" style={{ color: "#c9a227" }}>٥٠٬٠٠٠</span> مستخدم يثقون في FDT Estate للعثور على عقار أحلامهم.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(201,162,39,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all"
            style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)", color: "#fff" }}
          >
            ابحث عن عقارك
            <ArrowLeft size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: "rgba(201,162,39,0.6)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(201,162,39,0.25)",
              color: "#f0ede6",
              backdropFilter: "blur(12px)",
            }}
          >
            <Phone size={18} style={{ color: "#c9a227" }} />
            تواصل معنا
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
