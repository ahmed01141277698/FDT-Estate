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
} from "lucide-react";
const TYPE_CONFIG = {
  message: { icon: MessageCircle, color: "#e49263" },
  listing_liked: { icon: Heart, color: "#e11d48" },
  listing_view: { icon: Eye, color: "#6b7d76" },
  price_change: { icon: TrendingDown, color: "#183d37" },
  listing_approved: { icon: CheckCircle2, color: "#16a34a" },
  verification: { icon: BadgeCheck, color: "#c9a227" },
  system: { icon: Bell, color: "#a08a5f" },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  if (diff < 2592000) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(date).toLocaleDateString("ar-EG");
}

const TABS = [
  { key: "all", label: "الكل" },
  { key: "unread", label: "غير مقروءة" },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
    } catch {
      // best-effort
    }
  };

  const handleClick = (n) => {
    if (!n.read) handleMarkRead(n._id);
    if (n.link) navigate(n.link);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f5f0] px-5 py-12 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight text-[#183d37] sm:text-4xl">
            الإشعارات
          </h1>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 rounded-full border border-[#e7e2d7] bg-white px-4 py-2 text-sm font-bold text-[#183d37] transition hover:border-[#e49263] hover:text-[#e49263]"
          >
            <CheckCheck size={15} />
            تحديد الكل كمقروء
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                activeTab === tab.key
                  ? "border-[#183d37] bg-[#183d37] text-white"
                  : "border-[#e7e2d7] bg-white text-[#6b7d76] hover:border-[#e49263]/50 hover:text-[#e49263]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-[#e7e2d7] bg-white shadow-sm">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-16 text-[#a08a5f]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-semibold">جارٍ التحميل...</span>
            </div>
          )}

          {!loading && error && (
            <p className="py-16 text-center text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#183d37]/5">
                <Bell size={32} className="text-[#a08a5f]" strokeWidth={1.5} />
              </div>
              <p className="text-base font-bold text-[#183d37]">
                مفيش إشعارات لسه
              </p>
              <p className="max-w-xs text-sm text-[#6b7d76]">
                هنا هيظهرلك أي تحديثات على رسائلك وعقاراتك وحسابك
              </p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
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
                    className={`flex items-start gap-3 border-b border-[#f1efe8] px-5 py-4 last:border-0 ${
                      !n.read ? "bg-[#e49263]/5" : ""
                    }`}
                  >
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
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#183d37]">
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e49263]" />
                          )}
                        </span>
                        {n.body && (
                          <span className="mt-0.5 block text-sm text-[#6b7d76]">
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
                      className="shrink-0 rounded-full p-2 text-[#a9beb5] transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`grid size-9 place-items-center rounded-full text-sm font-bold transition ${
                  page === p
                    ? "bg-[#e49263] text-[#173d36]"
                    : "bg-[#183d37]/5 text-[#183d37] hover:bg-[#183d37]/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
