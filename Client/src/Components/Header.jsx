import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Bell, Heart, Menu, Plus, X } from "lucide-react";
import aqarxLogo from "../assets/aqarx-header-logo.png";

const NAV_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/AllListings", label: "العقارات" },
  { to: "/about", label: "حول" },
];

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.user || {});
  const isAuthenticated = Boolean(currentUser);
  const closeMenu = () => setMobileMenu(false);

  // Lock background scroll while the mobile menu is open so the
  // page behind it can't move under the overlay.
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  const avatarUrl =
    currentUser?.avatar?.url ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80";
  const displayName = currentUser?.username || "ملفي";
  const favoritesCount = useSelector((state) => state.favorites.count);

  // عداد الإشعارات غير المقروءة
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // إخفاق صامت — عداد خلفي، مش محتاج يعطّل الواجهة
    }
  }, []);

  // خط الدفاع الاحتياطي: polling كل 30 ثانية، شغال دايمًا بغض النظر عن
  // حالة اتصال SSE — لو الستريم عطل أو اتقفل، العداد لسه بيتحدث (بس أبطأ).
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  // التحديث اللحظي: اتصال SSE مفتوح — أول ما إشعار جديد يوصل، العداد
  // بيتحدث فورًا من غير ما نستنى الـ 30 ثانية. لو الاتصال فشل، المتصفح
  // بيحاول يعيد الاتصال لوحده تلقائيًا (سلوك EventSource الافتراضي).
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const source = new EventSource(
      `/api/notifications/stream?token=${encodeURIComponent(token)}`,
    );
    eventSourceRef.current = source;

    source.onmessage = () => {
      fetchUnreadCount();
    };

    source.onerror = () => {
      // مفيش داعي نعمل حاجة يدويًا هنا — المتصفح بيحاول يعيد الاتصال
      // لوحده، وخط الـ polling الاحتياطي فوق فاضل شغال في كل الأحوال.
    };

    return () => {
      source.close();
      eventSourceRef.current = null;
    };
  }, [isAuthenticated, fetchUnreadCount]);

  // إخفاء الهيدر بعد ما المستخدم يعدّي 60% من ارتفاع الصفحة — نفس منطق
  // الحساب زي الأول بالظبط، من غير أي تغيير. الفرق بقى بس في إزاي بيتطبّق
  // بصريًا تحت (fade متدرّج عنصر بعد التاني، مش سلاير واحد صلب).
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercentage =
        scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setHideHeader(scrolledPercentage > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // كلاس/ستايل مساعدين بس للتصميم — بيطبّقوا fade+translate متدرّج حسب
  // ترتيب العنصر (delayIndex)، مش بيغيّروا أي منطق.
  const fadeItem = () =>
    `transition-all duration-300 ease-in-out ${
      hideHeader
        ? "pointer-events-none -translate-y-2 opacity-0"
        : "translate-y-0 opacity-100"
    }`;
  const fadeStyle = (delayIndex = 0) => ({
    transitionDelay: `${hideHeader ? delayIndex * 55 : (4 - delayIndex) * 40}ms`,
  });

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 min-h-[62px] overflow-hidden bg-[#183d37] px-5 pb-3 pt-3 text-white transition-colors duration-300 sm:px-8 lg:px-12 ${
          hideHeader ? "opacity-0" : "opacity-100"
        }
        }`}
      >
        <div className="absolute -left-20 bottom-0 size-[30rem] rounded-full bg-[#e2a87b]/20 blur-3xl" />
        <div className="absolute right-[25%] top-24 size-64 rounded-full border border-white/10" />

        {/* Desktop Navigation */}
        <nav
          className={`sticky z-50 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 backdrop-blur-md transition-opacity duration-300 sm:px-6 `}
          style={{ transitionDelay: hideHeader ? "220ms" : "0ms" }}
        >
          {/* Logo — شفاف فعليًا (alpha حقيقي)، بلا خلفية بيضاء ولا نص منفصل */}
          <div style={fadeStyle(0)} className={fadeItem()}>
            <Link to="/" className="flex items-center">
              <img
                src={aqarxLogo}
                alt="Aqarx"
                className="h-11 w-auto object-contain sm:h-12"
              />
            </Link>
          </div>

          <div className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {NAV_LINKS.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                style={fadeStyle(i + 1)}
                className={`group relative py-1 ${fadeItem()}`}
              >
                <span className="transition-colors group-hover:text-[#f2b17e]">
                  {item.label}
                </span>
                <span className="absolute -bottom-0.5 right-0 h-[2px] w-0 rounded-full bg-[#f2b17e] transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div
              style={fadeStyle(4)}
              className={`hidden items-center gap-2 lg:flex ${fadeItem()}`}
            >
              <Link
                to="/create-listing"
                className="flex items-center gap-1.5 rounded-full bg-[#e49263] px-4 py-2 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
              >
                <Plus size={16} />
                إضافة عقار
              </Link>

              <Link
                to="/favorites"
                aria-label="المفضلة"
                className="relative grid size-10 place-items-center rounded-full transition hover:bg-white/10"
              >
                <Heart size={19} />

                {favoritesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/notifications"
                aria-label="الإشعارات"
                className="relative grid size-10 place-items-center rounded-full transition hover:bg-white/10"
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2.5 rounded-full py-1.5 pl-4 pr-1.5 transition hover:bg-white/10"
              >
                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-white/90 md:inline">
                  {displayName}
                </span>
                <span className="relative flex h-9 w-9 shrink-0">
                  <img
                    src={avatarUrl}
                    alt={
                      currentUser?.username || currentUser?.email || "Profile"
                    }
                    className="h-9 w-9 rounded-full border-2 border-white/40 object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#183d37] bg-emerald-500" />
                  </span>
                </span>
              </Link>
            </div>
          ) : (
            <div
              style={fadeStyle(4)}
              className={`hidden items-center gap-4 lg:flex ${fadeItem()}`}
            >
              <Link
                to="/signin"
                className="text-sm font-bold transition hover:text-[#f2b17e]"
              >
                دخول
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#e49263] px-5 py-2.5 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
              >
                إنشاء حساب
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="القائمة"
            style={fadeStyle(4)}
            className={`grid size-10 place-items-center rounded-full bg-white/10 lg:hidden ${fadeItem()}`}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* سبيسر بارتفاع الهيدر — بيحافظ على مكان المحتوى تحت الهيدر بما إنه fixed. */}
      <div className="min-h-[62px]" aria-hidden="true" />

      {/* Mobile Menu Backdrop — لازم يبقى برّه <header> عشان مايتقفلش جوه
          containing block بتاعه (transform/opacity على الهيدر كان بيخلي
          الـ fixed بتوع الستارة دي يتحسبوا بالنسبة للهيدر نفسه بدل الشاشة
          كلها، فكانت بتظهر مقطوعة نص فوق ونص تحت). دلوقتي هي وpanel القائمة
          سايبين برّه تمامًا فبيتصرفوا بالنسبة للشاشة زي ما المفروض. */}
      <div
        onClick={closeMenu}
        aria-hidden={!mobileMenu}
        className={`fixed inset-0 z-40 h-[100dvh] w-[100dvw] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        className={`fixed top-0 right-0 z-50 h-[100dvh] w-72 border-l border-white/10 bg-[#183d37]/95 text-white shadow-2xl backdrop-blur-md transition-transform duration-300 lg:hidden ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <img
            src={aqarxLogo}
            alt="Aqarx"
            className="h-9 w-auto object-contain"
          />
          <button
            onClick={closeMenu}
            aria-label="إغلاق"
            className="grid size-9 place-items-center rounded-full bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {isAuthenticated && (
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 border-b border-white/10 px-5 py-4 transition hover:bg-white/5"
          >
            <span className="relative flex h-11 w-11 shrink-0">
              <img
                src={avatarUrl}
                alt={currentUser?.username || currentUser?.email || "Profile"}
                className="h-11 w-11 rounded-full border-2 border-white/40 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#183d37] bg-emerald-500" />
              </span>
            </span>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold">{displayName}</span>
              <span className="text-xs font-medium text-emerald-400">
                متصل الآن
              </span>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-2 p-5 text-sm font-bold">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#f2b17e]"
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <Link
                to="/create-listing"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-xl bg-[#e49263] px-4 py-3 text-[#173d36] transition hover:bg-[#f1b68b]"
              >
                <Plus size={16} />
                إضافة عقار
              </Link>

              <Link
                to="/favorites"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#f2b17e]"
              >
                <div className="flex items-center gap-2">
                  <Heart size={16} />
                  المفضلة
                </div>

                {favoritesCount > 0 && (
                  <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/notifications"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#f2b17e]"
              >
                <div className="flex items-center gap-2">
                  <Bell size={16} />
                  الإشعارات
                </div>

                {unreadCount > 0 && (
                  <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <>
              <div className="my-2 h-px bg-white/10" />
              <Link
                to="/signin"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#f2b17e]"
              >
                دخول
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="rounded-full bg-[#e49263] px-4 py-3 text-center font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
