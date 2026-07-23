import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

/**
 * مودال كتابة/تعديل رأي — قابل للاستدعاء من أي مكان في الموقع
 * (الفوتر، صفحة البروفايل، سيكشن الآراء في الهوم).
 * بيجيب رأي المستخدم الحالي تلقائي لو موجود ويعبّي بيه الفورم للتعديل.
 */
export default function WriteReviewModal({ onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(true);
  const [error, setError] = useState("");

  // تحميل رأي المستخدم السابق (لو موجود) عشان يعدّل عليه بدل ما يبدأ من الصفر.
  useEffect(() => {
    fetch(`${API_BASE}/reviews/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((existing) => {
        if (existing) {
          setRating(existing.rating || 0);
          setText(existing.text || "");
          setRole(existing.role || "");
          setCity(existing.city || "");
        }
      })
      .catch(() => {})
      .finally(() => setFetchingExisting(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("اختر تقييمًا من ١ إلى ٥ نجوم");
      return;
    }
    if (!text.trim()) {
      setError("اكتب نص رأيك");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, text: text.trim(), role, city }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تعذّر إرسال رأيك");

      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        style={{ border: "1px solid rgba(201,162,39,0.25)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black" style={{ color: "#183d37" }}>
            شاركنا رأيك
          </h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full transition"
            style={{ background: "#f8f6f2", color: "#6b7a74" }}
          >
            <X size={16} />
          </button>
        </div>

        {fetchingExisting ? (
          <p
            className="mt-8 text-center text-sm font-semibold"
            style={{ color: "#6b7a74" }}
          >
            جاري التحميل...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                className="mb-2 block text-xs font-bold"
                style={{ color: "#6b7a74" }}
              >
                تقييمك
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      size={26}
                      fill={n <= (hoverRating || rating) ? "#c9a227" : "none"}
                      stroke={
                        n <= (hoverRating || rating) ? "#c9a227" : "#c7cdc9"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-bold"
                style={{ color: "#6b7a74" }}
              >
                رأيك
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="احكيلنا عن تجربتك مع مَسكَن..."
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                style={{
                  border: "1px solid rgba(24,61,55,0.12)",
                  background: "#f8f6f2",
                  color: "#183d37",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="mb-2 block text-xs font-bold"
                  style={{ color: "#6b7a74" }}
                >
                  المهنة (اختياري)
                </label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="مثال: مهندس"
                  className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    border: "1px solid rgba(24,61,55,0.12)",
                    background: "#f8f6f2",
                    color: "#183d37",
                  }}
                />
              </div>
              <div>
                <label
                  className="mb-2 block text-xs font-bold"
                  style={{ color: "#6b7a74" }}
                >
                  المدينة (اختياري)
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: القاهرة"
                  className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    border: "1px solid rgba(24,61,55,0.12)",
                    background: "#f8f6f2",
                    color: "#183d37",
                  }}
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl py-3 text-sm font-extrabold disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#c9a227,#e8833a)",
                color: "#183d37",
              }}
            >
              {loading ? "جاري الإرسال..." : "إرسال رأيي"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
