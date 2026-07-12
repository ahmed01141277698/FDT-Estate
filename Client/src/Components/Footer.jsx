import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Link,
  Play,
  ArrowLeft,
} from "lucide-react";

const LINKS = {
  company: [
    { label: "من نحن", href: "#" },
    { label: "وظائف", href: "#" },
    { label: "المدونة", href: "#" },
    { label: "اتصل بنا", href: "#" },
  ],
  properties: [
    { label: "فلل", href: "#" },
    { label: "شقق", href: "#" },
    { label: "تاون هاوس", href: "#" },
    { label: "مكاتب", href: "#" },
    { label: "أراضي", href: "#" },
  ],
  support: [
    { label: "مركز المساعدة", href: "#" },
    { label: "الشروط والأحكام", href: "#" },
    { label: "سياسة الخصوصية", href: "#" },
    { label: "الأسئلة الشائعة", href: "#" },
  ],
};

const SOCIALS = [
  { Icon: Globe, href: "#", label: "Instagram" },
  { Icon: Share2, href: "#", label: "Twitter" },
  { Icon: Link, href: "#", label: "LinkedIn" },
  { Icon: Play, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer
      className="relative pt-16 pb-8 px-4 md:px-8 lg:px-16"
      dir="rtl"
      style={{ borderTop: "1px solid rgba(201,162,39,0.12)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#c9a227,#e8833a)",
                }}
              >
                <span className="text-white font-black text-base">FDT</span>
              </div>
              <span className="text-xl font-bold" style={{ color: "#f0ede6" }}>
                FDT Estate
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "#8a8696" }}
            >
              منصة عقارية رائدة توفر أفضل العقارات الفاخرة في المملكة العربية
              السعودية بمستوى خدمة استثنائي وتجربة مستخدم لا مثيل لها.
            </p>
            <div className="space-y-2.5">
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#8a8696" }}
              >
                <MapPin size={14} style={{ color: "#c9a227" }} />
                الرياض، المملكة العربية السعودية
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#8a8696" }}
              >
                <Phone size={14} style={{ color: "#c9a227" }} />
                <span className="num" dir="ltr">
                  +966 11 000 0000
                </span>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#8a8696" }}
              >
                <Mail size={14} style={{ color: "#c9a227" }} />
                info@fdtestate.com
              </div>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "الشركة", links: LINKS.company },
            { title: "أنواع العقارات", links: LINKS.properties },
            { title: "الدعم", links: LINKS.support },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-4" style={{ color: "#f0ede6" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm transition-colors duration-200 hover:text-yellow-400"
                      style={{ color: "#8a8696" }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(201,162,39,0.15)",
          }}
        >
          <div>
            <h4 className="font-bold mb-1" style={{ color: "#f0ede6" }}>
              اشترك في نشرتنا البريدية
            </h4>
            <p className="text-sm" style={{ color: "#8a8696" }}>
              احصل على أحدث العقارات والعروض مباشرة في بريدك.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(201,162,39,0.2)",
                color: "#f0ede6",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
              style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
            >
              اشتراك <ArrowLeft size={15} />
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm" style={{ color: "#8a8696" }}>
            © <span className="num">2025</span> FDT Estate. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(201,162,39,0.15)",
                }}
              >
                <Icon size={16} style={{ color: "#c9a227" }} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
