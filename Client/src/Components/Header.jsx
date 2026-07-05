import { Link } from "react-router-dom";
import { FaSearch, FaAlignJustify, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user || {});
  const isAuthenticated = Boolean(currentUser);

  return (
    <header className="p-4 flex items-center justify-between bg-white shadow-md sticky top-0 z-10 gap-4">
      {/* Logo */}
      <Link to="/" className="text-xl sm:text-2xl font-bold flex-shrink-0">
        <span className="text-slate-700">FDT</span>
        <span className="text-yellow-500">Estate</span>
      </Link>

      {/* Desktop Search Bar */}
      <div className="hidden md:block flex-1 max-w-md">
        <form className="flex items-center gap-2">
          <input
            type="text"
            placeholder="ابحث عن عقارات..."
            className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <FaSearch /> بحث
          </button>
        </form>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link
          to="/"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          الرئيسية
        </Link>
        <Link
          to="/about"
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          حول
        </Link>

        {isAuthenticated ? (
          <Link
            to="/profile"
            className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-br from-blue-500 to-sky-400 shadow-sm">
              <img
                src={
                  currentUser?.avatar ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                }
                alt={currentUser?.username || currentUser?.email || "Profile"}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            {currentUser?.username || "ملفي"}
          </Link>
        ) : (
          <>
            <Link
              to="/signin"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              دخول
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              إنشاء حساب
            </Link>
          </>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <FaAlignJustify
          className="text-gray-700 cursor-pointer text-xl hover:text-blue-600 transition"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-slate-700">القائمة</h2>
          <FaTimes
            className="text-gray-700 cursor-pointer text-2xl hover:text-red-600 transition"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b">
          <form className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ابحث..."
              className="flex-1 bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="text-blue-600 hover:text-blue-700 transition"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Mobile Links */}
        <nav className="flex flex-col gap-1 p-4">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
          >
            الرئيسية
          </Link>

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
          >
            حول
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-br from-blue-500 to-sky-400 shadow-sm">
                <img
                  src={
                    currentUser?.avatar ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={currentUser?.username || currentUser?.email || "Profile"}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              {currentUser?.username || "ملفي"}
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
              >
                دخول
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
