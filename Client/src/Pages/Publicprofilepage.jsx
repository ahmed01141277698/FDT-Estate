import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Phone,
  Send,
  Building2,
  Home,
  Eye,
  Heart,
  CalendarDays,
  Globe,
  Loader2,
  SearchX,
} from "lucide-react";
import PropertyCard from "../Components/HomeSections/PropertyCard";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
const SOCIAL_ICONS = {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
};

// نفس منطق تحويل الرقم المصري لصيغة واتساب الدولية المستخدم في ContactCard
const toWhatsAppNumber = (phone) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return digits;
};

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e7e2d7] bg-white px-3 py-5 text-center shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e49263]/10">
        <Icon size={18} className="text-[#e49263]" />
      </div>
      <span className="text-xl font-black text-[#183d37]">{value}</span>
      <span className="text-xs font-bold text-[#a08a5f]">{label}</span>
    </div>
  );
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/users/${id}/public`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("not found");
        const json = await res.json();
        setData(json);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError") setStatus("error");
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [id]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="flex flex-col items-center gap-3 text-[#a08a5f]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-semibold">
            جارٍ تحميل الملف الشخصي...
          </span>
        </div>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f5f0] px-6 text-center"
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#183d37]/5">
          <SearchX size={40} className="text-[#a08a5f]" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-black text-[#183d37]">
          الملف الشخصي غير موجود
        </h1>
        <p className="max-w-sm text-sm text-[#6b7d76]">
          الرابط ده مش صحيح أو الحساب ده اتحذف.
        </p>
        <Link
          to="/"
          className="rounded-full bg-[#e49263] px-6 py-3 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const { user, listings, stats } = data;
  const whatsappNumber = toWhatsAppNumber(user.phone);
  const socialEntries = Object.entries(user.socialLinks || {}).filter(
    ([, url]) => Boolean(url),
  );
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f5f0] pb-20">
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-[#183d37] sm:h-56">
        <div className="absolute -left-16 bottom-0 size-64 rounded-full bg-[#e2a87b]/20 blur-3xl" />
        <div className="absolute right-[15%] top-8 size-48 rounded-full border border-white/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2622]/20 via-transparent to-[#183d37]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Identity dossier card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative -mt-16 rounded-[32px] border border-[#e7e2d7] bg-white p-6 shadow-[0_28px_80px_-30px_rgba(15,38,34,0.25)] sm:p-8"
        >
          {/* شهادة/سجل — نفس تفصيلة زوايا الشهادة المستخدمة في صفحات الدخول */}
          <span className="pointer-events-none absolute right-5 top-5 hidden size-4 border-r-2 border-t-2 border-[#c9a227]/40 sm:block" />
          <span className="pointer-events-none absolute left-5 top-5 hidden size-4 border-l-2 border-t-2 border-[#c9a227]/40 sm:block" />
          <span className="pointer-events-none absolute bottom-5 right-5 hidden size-4 border-b-2 border-r-2 border-[#c9a227]/40 sm:block" />
          <span className="pointer-events-none absolute bottom-5 left-5 hidden size-4 border-b-2 border-l-2 border-[#c9a227]/40 sm:block" />

          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:gap-6 sm:text-right">
            <div className="relative shrink-0">
              <img
                src={
                  user.avatar?.url ||
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.username || "User",
                  )}&background=183d37&color=fee0c4&size=200`
                }
                alt={user.username}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl sm:h-32 sm:w-32"
              />
              {user.isVerified && (
                <span className="absolute -bottom-1 -left-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#e8c56d] to-[#c9a227] shadow-md">
                  <BadgeCheck size={18} className="text-[#173d36]" />
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-black text-[#183d37] sm:text-3xl">
                  {user.username}
                </h1>
                {user.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-[#e8c56d]/20 px-3 py-1 text-xs font-extrabold text-[#a08a5f]">
                    <BadgeCheck size={13} />
                    حساب موثّق
                  </span>
                )}
                {user.accountType === "agency" && (
                  <span className="flex items-center gap-1 rounded-full bg-[#183d37]/5 px-3 py-1 text-xs font-extrabold text-[#183d37]">
                    <Building2 size={13} />
                    شركة عقارية
                  </span>
                )}
              </div>

              {memberSince && (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#6b7d76] sm:justify-start">
                  <CalendarDays size={14} className="text-[#a08a5f]" />
                  عضو منذ {memberSince}
                </p>
              )}

              {socialEntries.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {socialEntries.map(([platform, url]) => {
                    const Icon = SOCIAL_ICONS[platform] || Globe;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#183d37]/5 text-[#183d37] transition hover:bg-[#e49263] hover:text-[#173d36]"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contact actions */}
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
              <a
                href={user.phone ? `tel:${user.phone}` : undefined}
                aria-disabled={!user.phone}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold transition sm:flex-none ${
                  user.phone
                    ? "bg-[#183d37] text-white hover:bg-[#0f2622]"
                    : "cursor-not-allowed bg-[#e7e2d7] text-[#a9beb5]"
                }`}
              >
                <Phone size={16} />
                اتصال
              </a>
              <a
                href={
                  whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!whatsappNumber}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white transition sm:flex-none ${
                  whatsappNumber
                    ? "bg-[#25D366] hover:bg-[#1fb958]"
                    : "cursor-not-allowed bg-[#e7e2d7] text-[#a9beb5]"
                }`}
              >
                <Send size={16} />
                واتساب
              </a>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 grid grid-cols-3 gap-3 sm:gap-4"
        >
          <StatCard
            icon={Home}
            value={stats.listingsCount}
            label="عقار منشور"
          />
          <StatCard
            icon={Eye}
            value={stats.totalViews}
            label="إجمالي المشاهدات"
          />
          <StatCard
            icon={Heart}
            value={stats.totalFavorites}
            label="إضافات للمفضلة"
          />
        </motion.div>

        {/* Listings */}
        <div className="mt-10">
          <h2 className="mb-5 text-xl font-black text-[#183d37]">
            عقارات {user.username}
          </h2>

          {listings.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#e7e2d7] bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#183d37]/5">
                <Home size={26} className="text-[#a08a5f]" />
              </div>
              <p className="mt-4 text-base font-bold text-[#183d37]">
                لسه مفيش عقارات منشورة
              </p>
              <p className="mt-1 text-sm text-[#6b7d76]">
                هتظهر هنا أول ما {user.username} ينشر عقار جديد
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
              {listings.map((listing, index) => (
                <PropertyCard
                  key={listing._id}
                  property={listing}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
