// import { Link } from "react-router-dom";
// import { FaSearch, FaAlignJustify, FaTimes } from "react-icons/fa";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   ArrowUpLeft,
//   BadgeCheck,
//   BedDouble,
//   Building2,
//   CalendarDays,
//   CheckCircle2,
//   Heart,
//   LocateFixed,
//   MapPin,
//   Menu,
//   MessageCircle,
//   Phone,
//   Search,
//   ShieldCheck,
//   SlidersHorizontal,
//   Sparkles,
//   TrendingUp,
//   Users,
//   X,
// } from "lucide-react";
// const Header = () => {
//   const [open, setOpen] = useState(false);
//   const { currentUser } = useSelector((state) => state.user || {});
//   const isAuthenticated = Boolean(currentUser);
//   const [mobileMenu, setMobileMenu] = useState(false);

//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const handleSearch = (e) => {
//     e.preventDefault();

//     const q = searchQuery.trim();
//     if (!q) return;

//     // Smart search backend expects `q`.
//     navigate(`/search?q=${encodeURIComponent(q)}`);
//   };
//   return (
//     //  className="p-4 flex items-center justify-between bg-white shadow-md sticky top-0 z-10 gap-4"
//     <Header className="sticky z-50 top-0 min-h-[70px] overflow-hidden bg-[#183d37] px-5 pb-6 pt-5 text-white sm:px-8 lg:px-12> ">
//       <div className="absolute -left-20 bottom-0 size-[30rem] rounded-full bg-[#e2a87b]/20 blur-3xl" />
//       <div className="absolute right-[25%] top-24 size-64 rounded-full border border-white/10" />

//       {/* Desktop Search Bar */}
//       {/* <div className="hidden md:block flex-1 max-w-md">
//         <form onSubmit={handleSearch} className="flex items-center gap-2">
//           <input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             type="text"
//             placeholder="ابحث عن عقارات..."
//             className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
//           >
//             <FaSearch /> بحث
//           </button>
//         </form>
//       </div> */}

//       {/* Desktop Navigation */}
//       <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-md sm:px-6">
//         {/* Logo */}
//         <div className="flex items-center gap-2.5">
//           <Link to="/" className="flex items-center gap-2.5">
//             <div className="grid size-9 place-items-center rounded-xl bg-[#e49263] text-[#183d37]">
//               <Building2 size={21} strokeWidth={2.7} />
//             </div>
//             <span className="text-xl font-black tracking-tight">
//               مَسكَن
//             </span>{" "}
//           </Link>
//         </div>

//         <div className="hidden items-center gap-7 text-sm font-semibold lg:flex">
//           <Link to="/" className="transition hover:text-[#f2b17e]">
//             الرئيسية
//           </Link>
//           <Link to="/about" className="transition hover:text-[#f2b17e]">
//             حول
//           </Link>
//         </div>
//         {isAuthenticated ? (
//           <Link
//             to="/profile"
//             className="flex hover:text-[#f2b17e] items-center gap-3 text-sm font-medium text-gray-700  transition"
//           >
//             <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-br from-blue-500 to-sky-400 shadow-sm">
//               <img
//                 src={
//                   currentUser?.avatar.url ||
//                   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
//                 }
//                 alt={currentUser?.username || currentUser?.email || "Profile"}
//                 className="h-full w-full object-cover"
//               />
//               <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
//             </div>
//             {currentUser?.username || "ملفي"}
//           </Link>
//         ) : (
//           <>
//             <div className="hidden items-center gap-4 sm:flex">
//               <Link
//                 to="/signin"
//                 className="text-sm font-bold transition hover:text-[#f2b17e]"
//               >
//                 دخول
//               </Link>
//               <Link
//                 to="/signup"
//                 className="rounded-full bg-[#e49263] px-5 py-2.5 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
//               >
//                 إنشاء حساب
//               </Link>
//             </div>
//           </>
//         )}
//         <button
//           onClick={() => setMobileMenu(!mobileMenu)}
//           aria-label="القائمة"
//           className="grid size-10 place-items-center rounded-full bg-white/10 sm:hidden"
//         >
//           {mobileMenu ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </nav>

//       {/* Mobile Menu Button */}
//       <div className="md:hidden">
//         <FaAlignJustify
//           className="grid size-10 place-items-center rounded-full bg-white/10 sm:hidden"
//           onClick={() => setOpen(true)}
//         />
//       </div>

//       {/* Mobile Menu Overlay */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="relative z-30 mx-auto mt-2 flex max-w-7xl flex-col gap-4 rounded-3xl border border-white/10 bg-[#173c36] p-5 text-sm font-bold sm:hidden"
//         />
//       )}

//       {/* Mobile Menu Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Close Button */}

//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="grid size-10 place-items-center rounded-full bg-white/10 sm:hidden">
//             القائمة
//           </h2>
//           <FaTimes
//             className="grid size-10 place-items-center rounded-full bg-white/10 sm:hidden"
//             onClick={() => setOpen(false)}
//           />
//         </div>
//       </div>
//       {/* Mobile Search */}
//       {/* <div className="p-4 border-b">
//           <form
//             className="flex items-center gap-2"
//             onSubmit={(e) => {
//               e.preventDefault();
//               const form = e.currentTarget;
//               const input = form.querySelector('input[type="text"]');
//               const q = input?.value?.trim();
//               if (!q) return;
//               navigate(`/search?q=${encodeURIComponent(q)}`);
//               setOpen(false);
//             }}
//           >
//             <input
//               type="text"
//               defaultValue={searchQuery}
//               placeholder="ابحث..."
//               className="flex-1 bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//             <button
//               type="submit"
//               className="text-blue-600 hover:text-blue-700 transition"
//             >
//               <FaSearch />
//             </button>
//           </form>
//         </div> */}

//       {/* Mobile Links */}
//       {mobileMenu && (
//         <nav className="relative z-30 mx-auto mt-2 flex max-w-7xl flex-col gap-4 rounded-3xl border border-white/10 bg-[#173c36] p-5 text-sm font-bold sm:hidden">
//           <Link
//             to="/"
//             onClick={() => setOpen(false)}
//             className="transition hover:text-[#f2b17e]"
//           >
//             الرئيسية
//           </Link>

//           <Link
//             to="/about"
//             onClick={() => setOpen(false)}
//             className="transition hover:text-[#f2b17e]"
//           >
//             حول
//           </Link>

//           {isAuthenticated ? (
//             <Link
//               to="/profile"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-2 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
//             >
//               <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-br from-blue-500 to-sky-400 shadow-sm">
//                 <img
//                   src={
//                     currentUser?.avatar ||
//                     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
//                   }
//                   alt={currentUser?.username || currentUser?.email || "Profile"}
//                   className="h-full w-full object-cover"
//                 />
//                 <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
//               </div>
//               {currentUser?.username || "ملفي"}
//             </Link>
//           ) : (
//             <>
//               <Link
//                 to="/signin"
//                 onClick={() => setOpen(false)}
//                 className="text-sm font-bold transition hover:text-[#f2b17e]"
//               >
//                 دخول
//               </Link>
//               <Link
//                 to="/signup"
//                 onClick={() => setOpen(false)}
//                 className="rounded-full bg-[#e49263] py-3 text-[#173d36]"
//               >
//                 إنشاء حساب
//               </Link>
//             </>
//           )}
//         </nav>
//       )}
//     </Header>
//   );
// };

// export default Header;
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Building2, Menu, X } from "lucide-react";

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

  return (
    <header className="sticky z-50 top-0 min-h-[70px] overflow-hidden bg-[#183d37] px-5 pb-6 pt-5 text-white sm:px-8 lg:px-12">
      <div className="absolute -left-20 bottom-0 size-[30rem] rounded-full bg-[#e2a87b]/20 blur-3xl" />
      <div className="absolute right-[25%] top-24 size-64 rounded-full border border-white/10" />

      {/* Desktop Navigation */}
      <nav className="sticky z-50 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-md sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-[#e49263] text-[#183d37]">
              <Building2 size={21} strokeWidth={2.7} />
            </div>
            <span className="text-xl font-black tracking-tight">مَسكَن</span>
          </Link>
        </div>

        <div className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          <Link to="/" className="transition hover:text-[#f2b17e]">
            الرئيسية
          </Link>
          <Link to="/about" className="transition hover:text-[#f2b17e]">
            حول
          </Link>
        </div>

        {isAuthenticated ? (
          <Link
            to="/profile"
            className="hidden items-center gap-2.5 rounded-full py-1.5 pl-4 pr-1.5 transition hover:bg-white/10 lg:flex"
          >
            <span className="hidden max-w-[110px] truncate text-sm font-semibold text-white/90 md:inline">
              {displayName}
            </span>
            <span className="relative flex h-9 w-9 shrink-0">
              <img
                src={avatarUrl}
                alt={currentUser?.username || currentUser?.email || "Profile"}
                className="h-9 w-9 rounded-full border-2 border-white/40 object-cover"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#183d37] bg-emerald-500" />
              </span>
            </span>
          </Link>
        ) : (
          <div className="hidden items-center gap-4 lg:flex">
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
          className="grid size-10 place-items-center rounded-full bg-white/10 lg:hidden"
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        onClick={closeMenu}
        aria-hidden={!mobileMenu}
        className={`fixed inset-0 z-40 h-[100dvh] w-[100dvw] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Menu Drawer */}
      <nav
        className={`fixed top-0 right-0 z-50 h-[100dvh] w-72 border-l border-white/10 bg-[#183d37]/95 text-white shadow-2xl backdrop-blur-md transition-transform duration-300 lg:hidden ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-[#e49263] text-[#183d37]">
              <Building2 size={18} strokeWidth={2.7} />
            </div>
            <span className="text-lg font-black tracking-tight">مَسكَن</span>
          </div>
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
          <Link
            to="/"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#f2b17e]"
          >
            الرئيسية
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 transition hover:bg-white/10 hover:text-[#f2b17e]"
          >
            حول
          </Link>

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
    </header>
  );
};

export default Header;
