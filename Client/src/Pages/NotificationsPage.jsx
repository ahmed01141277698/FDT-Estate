import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageCircle,
  Heart,
  Eye,
  TrendingDown,
  CheckCircle2,
  BadgeCheck,
  CheckCheck,
  Trash2,
  Loader2,
  Settings,
  ChevronDown,
  KeyRound,
  MonitorSmartphone,
  Megaphone,
  ShieldAlert,
  UserCircle2,
  AlertTriangle,
} from "lucide-react";

const TYPE_CONFIG = {
  message: { icon: MessageCircle, color: "#e49263" },
  listing_liked: { icon: Heart, color: "#e11d48" },
  listing_view: { icon: Eye, color: "#6b7d76" },
  price_change: { icon: TrendingDown, color: "#183d37" },
  listing_approved: { icon: CheckCircle2, color: "#16a34a" },
  verification: { icon: BadgeCheck, color: "#c9a227" },
  password_change: { icon: KeyRound, color: "#a08a5f" },
  new_device_login: { icon: MonitorSmartphone, color: "#0284c7" },
  system_announcement: { icon: Megaphone, color: "#e49263" },
  account_suspension: { icon: ShieldAlert, color: "#dc2626" },
  avatar_change: { icon: UserCircle2, color: "#6b7d76" },
  system: { icon: Bell, color: "#a08a5f" },
};

const PREFERENCE_LABELS = {
  message: "اهتمام بعقاراتك (اتصال أو واتساب)",
  listing_liked: "إضافة عقاراتك إلى المفضلة",
  price_change: "تغيّرات الأسعار",
  listing_approved: "تأكيد نشر العقار",
  password_change: "تغيير كلمة المرور",
  new_device_login: "تسجيل الدخول من جهاز جديد",
  system_announcement: "إعلانات المنصّة",
  account_suspension: "تعليق الحساب",
  avatar_change: "تغيير الصورة الشخصية",
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 2592000) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(date).toLocaleDateString("ar-EG");
}

const TABS = [
  { key: "all", label: "الكل" },
  { key: "unread", label: "غير المقروءة" },
];

function PreferencesPanel() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    if (!open || prefs) return;
    fetch("/api/notifications/preferences", { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => setPrefs(data.preferences))
      .catch(() => setPrefs({}));
  }, [open, prefs]);

  const togglePref = async (key) => {
    const nextValue = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: nextValue }));
    setSaving(key);
    try {
      await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ [key]: nextValue }),
      });
    } catch {
      setPrefs((prev) => ({ ...prev, [key]: !nextValue }));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e7e2d7] bg-white shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 transition hover:bg-[#faf9f6]"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-[#183d37]">
          <Settings size={16} className="text-[#a08a5f]" />
          إعدادات الإشعارات
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[#a08a5f]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#f1efe8] px-5 py-4">
              <p className="mb-3 text-xs leading-6 text-[#6b7d76]">
                اختر أنواع الإشعارات التي ترغب في تلقّيها. يمكنك تعديل هذه
                الإعدادات في أي وقت.
              </p>

              {!prefs && (
                <p className="py-4 text-center text-sm font-semibold text-[#a08a5f]">
                  جارٍ التحميل...
                </p>
              )}

              {prefs && (
                <div className="divide-y divide-[#f1efe8]">
                  {Object.entries(PREFERENCE_LABELS).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <span className="text-sm font-semibold text-[#183d37]">
                        {label}
                      </span>
                      <button
                        onClick={() => togglePref(key)}
                        disabled={saving === key}
                        aria-pressed={Boolean(prefs[key])}
                        aria-label={label}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
                          prefs[key] ? "bg-[#e49263]" : "bg-[#e7e2d7]"
                        }`}
                      >
                        <motion.span
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                            prefs[key] ? "right-0.5" : "right-[22px]"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [clearing, setClearing] = useState(false);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ page, limit: 15 });
        if (activeTab === "unread") params.set("unreadOnly", "true");

        const res = await fetch(`/api/notifications?${params.toString()}`, {
          headers: authHeaders(),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("تعذّر تحميل الإشعارات");
        const data = await res.json();
        setNotifications(data.notifications || []);
        setTotalPages(data.totalPages || 1);
        setUnreadCount(data.unreadCount || 0);
        setTotal(data.total || 0);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    return () => controller.abort();
  }, [activeTab, page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleMarkRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: authHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: authHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  const handleDelete = async (id) => {
    const target = notifications.find((n) => n._id === id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (target && !target.read) setUnreadCount((c) => Math.max(0, c - 1));
    setTotal((t) => Math.max(0, t - 1));
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  const handleDeleteAll = async () => {
    setClearing(true);
    try {
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: authHeaders(),
      });
      setNotifications([]);
      setUnreadCount(0);
      setTotal(0);
      setTotalPages(1);
      setPage(1);
      setConfirmClearAll(false);
    } catch {
      setError("تعذّر حذف الإشعارات، يُرجى المحاولة مرة أخرى");
    } finally {
      setClearing(false);
    }
  };

  const handleClick = (n) => {
    if (!n.read) handleMarkRead(n._id);
    if (n.link) navigate(n.link);
  };

  const hasNotifications = notifications.length > 0;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f5f0] px-5 py-12 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-3xl">
        {/* العنوان */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#183d37] sm:text-4xl">
            الإشعارات
          </h1>
          <p className="mt-2 text-sm font-semibold text-[#6b7d76]">
            {unreadCount > 0
              ? `لديك ${unreadCount} ${unreadCount === 1 ? "إشعار" : "إشعارات"} غير مقروءة`
              : "جميع إشعاراتك مقروءة"}
          </p>
        </div>

        {/* شريط الأدوات: التبويبات + الإجراءات */}
        <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-[#e7e2d7] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeTab === tab.key
                    ? "bg-[#183d37] text-white"
                    : "text-[#6b7d76] hover:bg-[#faf9f6] hover:text-[#e49263]"
                }`}
              >
                {tab.label}
                {tab.key === "unread" && unreadCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-extrabold ${
                      activeTab === "unread"
                        ? "bg-white/20 text-white"
                        : "bg-[#e49263] text-[#173d36]"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 rounded-full border border-[#e7e2d7] px-4 py-2 text-sm font-bold text-[#183d37] transition hover:border-[#e49263] hover:text-[#e49263] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#e7e2d7] disabled:hover:text-[#183d37]"
            >
              <CheckCheck size={15} />
              تعيين الكل كمقروء
            </button>

            <button
              onClick={() => setConfirmClearAll(true)}
              disabled={total === 0}
              className="flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Trash2 size={15} />
              حذف الكل
            </button>
          </div>
        </div>

        {/* قائمة الإشعارات */}
        <div className="mt-4 overflow-hidden rounded-[28px] border border-[#e7e2d7] bg-white shadow-sm">
          {loading && (
            <div className="divide-y divide-[#f1efe8]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#f1efe8]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/3 animate-pulse rounded-full bg-[#f1efe8]" />
                    <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#f1efe8]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertTriangle size={28} className="text-red-500" />
              <p className="text-sm font-bold text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && !hasNotifications && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#183d37]/5">
                <Bell size={32} className="text-[#a08a5f]" strokeWidth={1.5} />
              </div>
              <p className="text-base font-bold text-[#183d37]">
                {activeTab === "unread"
                  ? "لا توجد إشعارات غير مقروءة"
                  : "لا توجد إشعارات بعد"}
              </p>
              <p className="max-w-xs text-sm leading-6 text-[#6b7d76]">
                {activeTab === "unread"
                  ? "لقد اطّلعت على جميع إشعاراتك."
                  : "ستظهر هنا جميع المستجدّات المتعلقة بعقاراتك وحسابك."}
              </p>
            </div>
          )}

          {!loading && !error && hasNotifications && (
            <AnimatePresence initial={false}>
              {notifications.map((n) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`group flex items-start gap-3 border-b border-[#f1efe8] px-5 py-4 transition last:border-0 hover:bg-[#faf9f6] ${
                      !n.read ? "bg-[#e49263]/[0.06]" : ""
                    }`}
                  >
                    {/* شريط جانبي يميّز غير المقروء */}
                    <span
                      aria-hidden="true"
                      className={`mt-1 h-10 w-[3px] shrink-0 rounded-full ${
                        !n.read ? "bg-[#e49263]" : "bg-transparent"
                      }`}
                    />

                    <button
                      onClick={() => handleClick(n)}
                      className="flex min-w-0 flex-1 items-start gap-3 text-right"
                    >
                      <span
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${config.color}1a` }}
                      >
                        <Icon size={17} style={{ color: config.color }} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm text-[#183d37] ${
                            !n.read ? "font-black" : "font-bold"
                          }`}
                        >
                          {n.title}
                        </span>
                        {n.body && (
                          <span className="mt-0.5 block text-sm leading-6 text-[#6b7d76]">
                            {n.body}
                          </span>
                        )}
                        <span className="mt-1 block text-xs font-semibold text-[#a9beb5]">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(n._id)}
                      aria-label="حذف الإشعار"
                      className="shrink-0 rounded-full p-2 text-[#a9beb5] opacity-0 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* ترقيم الصفحات */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={page === p ? "page" : undefined}
                className={`grid size-9 place-items-center rounded-full text-sm font-bold transition ${
                  page === p
                    ? "bg-[#e49263] text-[#173d36]"
                    : "bg-white text-[#183d37] hover:bg-[#183d37]/5"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          <PreferencesPanel />
        </div>
      </div>

      {/* تأكيد حذف الكل */}
      <AnimatePresence>
        {confirmClearAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2622]/60 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              dir="rtl"
              className="w-full max-w-md rounded-[28px] border border-[#e7e2d7] bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#183d37]">
                    حذف جميع الإشعارات
                  </h3>
                  <p className="text-sm font-semibold text-[#6b7d76]">
                    لا يمكن التراجع عن هذا الإجراء
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[#6b7d76]">
                سيتم حذف جميع إشعاراتك نهائيًا. هل أنت متأكد من المتابعة؟
              </p>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="rounded-2xl border border-[#e7e2d7] px-4 py-2.5 text-sm font-bold text-[#183d37] transition hover:bg-[#faf9f6]"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={clearing}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {clearing ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  {clearing ? "جارٍ الحذف..." : "حذف الكل"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
