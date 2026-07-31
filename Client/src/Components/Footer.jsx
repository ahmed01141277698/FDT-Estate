import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  MessageSquarePlus,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import WriteReviewModal from "./HomeSections/WriteReviewModal";

const PROPERTY_LINKS = [
  { label: "كل العقارات", to: "/AllListings" },
  { label: "شقق", to: "/AllListings?category=شقة" },
  { label: "فلل", to: "/AllListings?category=فيلا" },
  { label: "تاون هاوس", to: "/AllListings?category=تاون هاوس" },
  { label: "دوبلكس", to: "/AllListings?category=دوبلكس" },
  { label: "مكاتب", to: "/AllListings?category=مكتب" },
  { label: "أراضي", to: "/AllListings?category=أرض" },
];

const COMPANY_LINKS = ["من نحن", "وظائف", "المدونة", "اتصل بنا"];
const SUPPORT_LINKS = [
  "مركز المساعدة",
  "الشروط والأحكام",
  "سياسة الخصوصية",
  "الأسئلة الشائعة",
];

// أيقونات السوشيال ميديا من react-icons بدل lucide-react (اللي شالت أيقونات
// العلامات التجارية زي Facebook/Instagram من نسخها الحديثة).
const SOCIALS = [
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaYoutube, label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer
      className="relative px-4 pb-8 pt-16 md:px-8 lg:px-16"
      dir="rtl"
      style={{
        background: "linear-gradient(180deg, #0e0e16 0%, #0b1a17 100%)",
      }}
    >
      <div
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,39,0.08) 0%, transparent 60%)",
        }}
      >
        <div className="relative mx-auto max-w-7xl">
          {/* ============ Grid: Brand + Links ============ */}
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="grid size-10 place-items-center rounded-xl bg-[#e49263] text-[#183d37]">
                  <span className="text-lg font-black">م</span>
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  مَسكَن
                </span>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-[#c6d3ce]">
                منصة عقارية رائدة توفر أفضل العقارات المصرية بمستوى خدمة
                استثنائي وتجربة مستخدم لا مثيل لها.
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-[#c6d3ce]">
                  <MapPin size={14} className="text-[#f1b184]" />٦ أكتوبر،
                  الجيزة، مصر
                </div>

                <a
                  href="tel:+201553007698"
                  className="flex items-center gap-2 text-sm text-[#c6d3ce] transition-colors hover:text-[#f2b17e]"
                >
                  <Phone size={14} className="text-[#f1b184]" />
                  <span className="num" dir="ltr">
                    +20 155 300 7698
                  </span>
                </a>

                <a
                  href="mailto:ahmedalfaod230@gmail.com"
                  className="flex items-center gap-2 text-sm text-[#c6d3ce] transition-colors hover:text-[#f2b17e]"
                >
                  <Mail size={14} className="text-[#f1b184]" />
                  <span dir="ltr">ahmedalfaod230@gmail.com</span>
                </a>
              </div>
            </div>

            {/* أنواع العقارات */}
            <div>
              <h4 className="mb-4 font-black text-white">أنواع العقارات</h4>
              <ul className="space-y-2.5">
                {PROPERTY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-[#c6d3ce] transition-colors duration-200 hover:text-[#f2b17e]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* الشركة */}
            <div>
              <h4 className="mb-4 font-black text-white">الشركة</h4>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((label) => (
                  <li key={label}>
                    <span className="flex cursor-not-allowed items-center gap-2 text-sm text-[#c6d3ce] opacity-60">
                      {label}
                      <span className="rounded-full bg-[#f1b184]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#f1b184]">
                        قريبًا
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* الدعم */}
            <div>
              <h4 className="mb-4 font-black text-white">الدعم</h4>
              <ul className="space-y-2.5">
                {SUPPORT_LINKS.map((label) => (
                  <li key={label}>
                    <span className="flex cursor-not-allowed items-center gap-2 text-sm text-[#c6d3ce] opacity-60">
                      {label}
                      <span className="rounded-full bg-[#f1b184]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#f1b184]">
                        قريبًا
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* ============ نهاية الـ Grid ============ */}

          {/* Newsletter */}
          <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-6 md:flex-row">
            <div>
              <h4 className="mb-1 font-black text-white">
                اشترك في نشرتنا البريدية
              </h4>
              <p className="text-sm text-[#c6d3ce]">
                {subscribed
                  ? "الخدمة هتتفعّل قريبًا — هنبلغك أول ما تبقى جاهزة 🌱"
                  : "احصل على أحدث العقارات والعروض مباشرة في بريدك."}
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full gap-2 md:w-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                disabled={subscribed}
                className="flex-1 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#8fa39a] disabled:opacity-50 md:w-64"
              />
              <motion.button
                type="submit"
                disabled={subscribed}
                whileHover={{ scale: subscribed ? 1 : 1.04 }}
                whileTap={{ scale: subscribed ? 1 : 0.97 }}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-[#183d37] disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg,#c9a227,#e8833a)",
                }}
              >
                {subscribed ? "تم" : "اشتراك"} <ArrowLeft size={15} />
              </motion.button>
            </form>
          </div>

          {/* شاركنا رأيك */}
          <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-6 md:flex-row">
            <div>
              <h4 className="mb-1 font-black text-white">
                جربت مَسكَن قبل كده؟
              </h4>
              <p className="text-sm text-[#c6d3ce]">
                رأيك بيفرق معانا — شاركنا تجربتك في دقيقة واحدة.
              </p>
            </div>

            <motion.button
              onClick={() => setShowReviewModal(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-[#183d37]"
              style={{ background: "linear-gradient(135deg,#c9a227,#e8833a)" }}
            >
              <MessageSquarePlus size={16} />
              شاركنا رأيك
            </motion.button>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
            <p className="text-sm text-[#a9beb5]">
              © <span className="num">2025</span> مَسكَن. جميع الحقوق محفوظة.
            </p>

            <div className="flex gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <span
                  key={label}
                  title="قريبًا"
                  aria-disabled="true"
                  className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] opacity-50"
                >
                  <Icon size={16} className="text-[#f1b184]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <WriteReviewModal
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => setShowReviewModal(false)}
        />
      )}
    </footer>
  );
}
