import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  MessageCircle,
  Heart,
  Eye,
  TrendingDown,
  CheckCircle2,
  BadgeCheck,
  CheckCheck,
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

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications/unread-count", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // إخفاق صامت — عداد خلفي، مش محتاج يعطّل الواجهة
    }
  };

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=6", {
        headers: authHeaders(),
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
      if (typeof data.unreadCount === "number")
        setUnreadCount(data.unreadCount);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) fetchRecent();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: authHeaders(),
      });
    } catch {
      // الحالة اتحدثت بصريًا؛ لو الطلب فشل هيتصحح تلقائيًا في أقرب poll
    }
  };

  const handleNotificationClick = async (notification) => {
    setOpen(false);
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, read: true } : n,
        ),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await fetch(`/api/notifications/${notification._id}/read`, {
          method: "PUT",
          headers: authHeaders(),
        });
      } catch {
        // best-effort
      }
    }
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="الإشعارات"
        className="relative grid size-10 place-items-center rounded-full transition hover:bg-white/10"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e49263] px-1 text-[10px] font-extrabold text-[#173d36]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            dir="rtl"
            className="absolute left-0 top-12 z-50 w-80 overflow-hidden rounded-[24px] border border-[#e7e2d7] bg-white text-right shadow-2xl shadow-[#0f2622]/20 sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-[#e7e2d7] px-4 py-3">
              <h3 className="text-sm font-black text-[#183d37]">الإشعارات</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs font-bold text-[#e49263] hover:text-[#c9763f]"
                >
                  <CheckCheck size={13} />
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <p className="py-10 text-center text-sm font-semibold text-[#a08a5f]">
                  جارٍ التحميل...
                </p>
              )}

              {!loading && notifications.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <Bell size={28} className="text-[#e7e2d7]" />
                  <p className="text-sm font-semibold text-[#a08a5f]">
                    مفيش إشعارات جديدة دلوقتي
                  </p>
                </div>
              )}

              {!loading &&
                notifications.map((n) => {
                  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                  const Icon = config.icon;
                  return (
                    <button
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`flex w-full items-start gap-3 border-b border-[#f1efe8] px-4 py-3 text-right transition hover:bg-[#faf9f6] ${
                        !n.read ? "bg-[#e49263]/5" : ""
                      }`}
                    >
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${config.color}1a` }}
                      >
                        <Icon size={16} style={{ color: config.color }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="line-clamp-1 text-sm font-bold text-[#183d37]">
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e49263]" />
                          )}
                        </span>
                        {n.body && (
                          <span className="line-clamp-2 text-xs font-medium text-[#6b7d76]">
                            {n.body}
                          </span>
                        )}
                        <span className="mt-0.5 block text-[11px] font-semibold text-[#a9beb5]">
                          {timeAgo(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  );
                })}
            </div>

            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-[#e7e2d7] px-4 py-3 text-center text-sm font-bold text-[#183d37] transition hover:bg-[#faf9f6] hover:text-[#e49263]"
            >
              عرض كل الإشعارات
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
