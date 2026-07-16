import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

export default function FloatingNavbar() {
  const { currentUser } = useSelector((state) => state.user || {});
  const isAuthenticated = Boolean(currentUser);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className="px-4 md:px-8 lg:px-16"
        style={{
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div
          className="rounded-2xl"
          style={{
            backdropFilter: "blur(20px)",
            background: scrolled
              ? "rgba(14,14,22,0.92)"
              : "rgba(14,14,22,0.35)",
            border: "1px solid rgba(201,162,39,0.18)",
            boxShadow: scrolled ? "0 18px 60px rgba(0,0,0,0.35)" : "none",
          }}
        >
          <div
            className="flex items-center justify-between gap-4 px-4 py-3 md:px-6"
            dir="rtl"
          >
            <Link
              to="/"
              className="flex items-center gap-2 font-bold"
              onClick={() => setOpen(false)}
            >
              <span
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#c9a227,#e8833a)",
                }}
              >
                <span className="text-white font-black">FDT</span>
              </span>
              <span
                className="text-base sm:text-lg"
                style={{ color: "#f0ede6" }}
              >
                FDT Estate
              </span>
            </Link>

            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="القائمة"
            >
              <Link
                to="/"
                className="text-sm font-medium"
                style={{ color: "#c8c3bc" }}
              >
                الرئيسية
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium"
                style={{ color: "#c8c3bc" }}
              >
                حول
              </Link>

              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن عقار..."
                  className="w-48 bg-transparent px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    color: "#f0ede6",
                    border: "1px solid rgba(201,162,39,0.16)",
                  }}
                  aria-label="بحث"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#c9a227,#e8833a)",
                  }}
                  aria-label="بحث"
                >
                  <FaSearch color="#fff" />
                </button>
              </form>

              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-3"
                  onClick={() => setOpen(false)}
                >
                  <div
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2"
                    style={{ borderColor: "rgba(201,162,39,0.55)" }}
                  >
                    <img
                      src={
                        currentUser?.avatar?.url ||
                        currentUser?.avatar ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={
                        currentUser?.username || currentUser?.email || "Profile"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#f0ede6" }}
                  >
                    {currentUser?.username || "ملفي"}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/signin"
                    className="text-sm font-medium"
                    style={{ color: "#c8c3bc" }}
                  >
                    دخول
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg,#c9a227,#e8833a)",
                      color: "#fff",
                    }}
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </nav>

            <div className="md:hidden">
              <button
                type="button"
                className="px-4 py-2 rounded-xl"
                style={{
                  border: "1px solid rgba(201,162,39,0.18)",
                  color: "#f0ede6",
                  background: "rgba(255,255,255,0.04)",
                }}
                onClick={() => setOpen((v) => !v)}
                aria-label="فتح القائمة"
              >
                Menu
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden px-4 pb-4" dir="rtl">
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,162,39,0.12)",
                    color: "#f0ede6",
                  }}
                  onClick={() => setOpen(false)}
                >
                  الرئيسية
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,162,39,0.12)",
                    color: "#f0ede6",
                  }}
                  onClick={() => setOpen(false)}
                >
                  حول
                </Link>

                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن عقار..."
                    className="flex-1 bg-transparent px-3 py-2 rounded-xl text-sm outline-none"
                    style={{
                      color: "#f0ede6",
                      border: "1px solid rgba(201,162,39,0.16)",
                    }}
                    aria-label="بحث"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#c9a227,#e8833a)",
                    }}
                    aria-label="بحث"
                  >
                    <FaSearch color="#fff" />
                  </button>
                </form>

                {isAuthenticated ? (
                  <Link
                    to="/profile"
                    className="block px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(201,162,39,0.16)",
                      border: "1px solid rgba(201,162,39,0.22)",
                      color: "#f0ede6",
                    }}
                    onClick={() => setOpen(false)}
                  >
                    ملفي
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/signin"
                      className="block px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(201,162,39,0.12)",
                        color: "#f0ede6",
                      }}
                      onClick={() => setOpen(false)}
                    >
                      دخول
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 rounded-xl text-center"
                      style={{
                        background: "linear-gradient(135deg,#c9a227,#e8833a)",
                        color: "#fff",
                      }}
                      onClick={() => setOpen(false)}
                    >
                      إنشاء
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
