import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ChevronDown,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const PROPERTY_TYPES = [
  { label: "شقة", query: "شقة" },
  { label: "فيلا", query: "فيلا" },
  { label: "دوبلكس", query: "دوبلكس" },
  { label: "شاليه", query: "شاليه" },
];

const TRENDING_AREAS = [
  "التجمع الخامس",
  "الشيخ زايد",
  "العاصمة الإدارية",
  "المعادي",
];

const STATS = [
  ["+12,400", "عقار متاح"],
  ["+4,800", "عميل سعيد"],
  ["+28", "مدينة وحي"],
  ["98%", "إعلانات موثّقة"],
];

// نص متغيّر لإضفاء إحساس بالحيوية على الصفحة — عرض فقط، لا يتصل بأي منطق.
const LIVE_SIGNALS = [
  "ثلاثة أشخاص يبحثون في التجمع الخامس الآن",
  "عقار جديد أُضيف منذ تسع دقائق في الشيخ زايد",
  "أكثر من مئتي أسرة وجدت بيتها هذا الشهر",
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [signalIndex, setSignalIndex] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const q = searchQuery.trim();
    if (!q) return;

    // الخادم الذكي للبحث يتوقّع باراميتر `q`.
    navigate(`/search?q=${encodeURIComponent(q)}`);

    // TODO(بحث بالذكاء الاصطناعي): عند جاهزية الخادم الذكي، أضِف التفرّع هنا بدلاً
    // من الاستدعاء أعلاه، على سبيل المثال:
    // navigate(`/search?q=${encodeURIComponent(q)}&mode=ai`)
  };

  // تبديل نص الإشارة الحيّة كل بضع ثوانٍ.
  useEffect(() => {
    const id = setInterval(
      () => setSignalIndex((i) => (i + 1) % LIVE_SIGNALS.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[200px] overflow-hidden bg-[#183d37] px-5 pb-24 pt-5 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f2622]/40 via-[#183d37]/70 to-[#183d37] opacity-90">
        <img
          src="https://images.pexels.com/photos/33021028/pexels-photo-33021028.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
        />
      </div>
      <div className="absolute -left-20 bottom-0 size-[30rem] rounded-full bg-[#e2a87b]/20 blur-3xl" />
      <div className="absolute right-[25%] top-24 size-64 rounded-full border border-white/10" />

      {/* ختم التوثيق — إشارة هادئة إلى "السجل العقاري" بوصفه سجلًا رسميًا، لا مجرد إعلانات. */}
      <div
        aria-hidden="true"
        className="border-gold-gradient absolute left-[6%] top-28 hidden size-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm motion-safe:animate-[spin_22s_linear_infinite] lg:flex"
      >
        <svg viewBox="0 0 100 100" className="size-[88px]">
          <defs>
            <path
              id="stampCircle"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text
            fill="#e8c56d"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="2"
          >
            <textPath href="#stampCircle" startOffset="0%">
              مَسكَن ★ السجل العقاري ★
            </textPath>
          </text>
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 pt-2 text-center sm:pt-14">
        <div className="motion-safe:animate-[fadeInUp_0.6s_ease] inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-bold text-[#fee0c4]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f1b184] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f1b184]" />
          </span>
          منصتك الأولى لفهم قصة كل بيت في مصر
        </div>

        <h1 className="motion-safe:animate-[fadeInUp_0.6s_ease_0.1s_backwards] max-w-4xl text-5xl font-black leading-[2] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block">ابحثْ، قارِنْ، واطمئن</span>
          <span className="text-gold-gradient py-4 block sm:mt-4 text-wrap  ">
            فبيتك الحقيقي في انتظارك.
          </span>
        </h1>

        <p className="motion-safe:animate-[fadeInUp_0.6s_ease_0.2s_backwards] max-w-xl text-base leading-8 text-[#d7e0dc] sm:text-lg">
          آلاف العقارات الموثّقة بين يديك، وبحث ذكي يقودك إلى المنزل المناسب من
          أول محاولة، دون إضاعة لوقتك أو جهدك.
        </p>

        <form
          onSubmit={handleSearch}
          className="motion-safe:animate-[fadeInUp_0.6s_ease_0.3s_backwards] mt-2 flex w-full max-w-3xl flex-col gap-2 rounded-[26px] bg-[#f8f8f3] p-2.5 text-right shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:rounded-full"
        >
          <label className="flex flex-1 items-center gap-3 px-4 py-3 text-[#789087]">
            <MapPin size={21} className="shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن المنطقة، أو الحي، أو الشارع"
              className="w-full bg-transparent text-sm font-semibold text-[#183d37] outline-none placeholder:text-[#8a9992]"
            />
          </label>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#e49263] px-7 py-4 text-sm font-extrabold text-[#183d37] transition hover:bg-[#ecb18a] sm:rounded-full"
          >
            <Search size={18} /> ابحث عن بيتك الآن
          </button>
        </form>

        {/* اختصارات نوع العقار — نقرة واحدة تملأ حقل البحث نفسه أعلاه. */}
        <div className="-mt-4 flex flex-wrap items-center justify-center gap-2">
          {PROPERTY_TYPES.map(({ label, query }) => (
            <button
              key={label}
              type="button"
              onClick={() => setSearchQuery(query)}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-bold text-[#dce5e0] transition hover:border-[#f2b17e] hover:text-[#f2b17e]"
            >
              {label}
            </button>
          ))}

          {/* بحث بالذكاء الاصطناعي — تمهيد بصري لوضع البحث الذكي القادم. */}
          <span
            title="سيُطلق قريبًا"
            className="flex cursor-not-allowed items-center gap-1.5 rounded-full border border-dashed border-[#c9a227]/60 px-3.5 py-1.5 text-xs font-bold text-[#e8c56d] opacity-80"
          >
            <Sparkles size={13} /> بحث بالذكاء الاصطناعي
            <span className="rounded-full bg-[#c9a227]/20 px-1.5 py-0.5 text-[10px]">
              قريبًا
            </span>
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold text-[#dce5e0]">
          <span className="text-[#a9beb5]">الأكثر بحثًا هذا الأسبوع:</span>
          {TRENDING_AREAS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSearchQuery(item)}
              className="rounded-full border border-white/15 px-3 py-1.5 hover:border-[#f2b17e] hover:text-[#f2b17e]"
            >
              {item}
            </button>
          ))}
        </div>

        {/* إشارة حيّة — سطر متغيّر يمنح الصفحة إحساسًا بالحركة والحيوية. */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#a9beb5]">
          <Clock3 size={14} className="text-[#f1b184]" />
          <span
            key={signalIndex}
            className="motion-safe:animate-[fadeInUp_0.4s_ease]"
          >
            {LIVE_SIGNALS[signalIndex]}
          </span>
        </div>

        {/* علامات الثقة — إجابة مباشرة عن المخاوف التي تراود الباحث عن عقار. */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-bold text-[#c6d3ce]">
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#f1b184]" /> عقارات مُتحقَّق
            منها
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck size={16} className="text-[#f1b184]" /> بلا عمولات خفية
          </span>
          <span className="flex items-center gap-2">
            <Clock3 size={16} className="text-[#f1b184]" /> دعم متواصل على مدار
            الساعة
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:grid-cols-4">
        {STATS.map(([number, label]) => (
          <div key={label} className="text-center">
            <strong className="block text-2xl font-black text-[#f1b184] sm:text-3xl">
              {number}
            </strong>
            <span className="mt-1.5 block text-xs font-semibold text-[#c6d3ce]">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* دعوة للتمرير — إشارة هادئة نحو قوائم العقارات أسفل الصفحة. */}
      <a
        href="#listings"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[11px] font-semibold text-[#a9beb5] transition hover:text-[#f2b17e] sm:flex"
      >
        استكشف أحدث العقارات
        <ChevronDown size={16} className="motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
