import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bath,
  BedDouble,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Eye,
  Home,
  LogOut,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { signOut, updateUserSuccess } from "../../redux/user/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    password: "",
  });
  const [avatar, setAvatar] = useState(currentUser?.avatar?.url || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    setAvatar(currentUser?.avatar?.url || "");
    setFormData({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      password: "",
    });
  }, [currentUser]);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!currentUser?._id) return;
      setListingsLoading(true);
      try {
        const res = await fetch(`/api/listing/user/${currentUser._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setUserListings(Array.isArray(data) ? data : []);
      } catch (error) {
        setUserListings([]);
      } finally {
        setListingsLoading(false);
      }
    };

    fetchUserListings();
  }, [currentUser]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: "", type: "" }), 3200);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("يرجى اختيار صورة صالحة", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("حجم الصورة يجب أن يكون أقل من 5 ميجابايت", "error");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      showToast("يرجى ملء الاسم والبريد الإلكتروني", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let uploadedAvatar = currentUser?.avatar || null;
      if (avatarFile) {
        const uploadPayload = new FormData();
        uploadPayload.append("avatar", avatarFile);
        const uploadRes = await fetch("/api/user/profile/avatar", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadPayload,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.message || "فشل رفع الصورة");
        uploadedAvatar = uploadData.avatar;
      }
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          ...(formData.phone && { phone: formData.phone.trim() }),
          ...(formData.password && { password: formData.password }),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث البيانات");
      const updatedUser = data.user || data;
      const finalAvatar =
        uploadedAvatar || updatedUser.avatar || currentUser.avatar;

      dispatch(
        updateUserSuccess({
          ...currentUser,
          ...updatedUser,
          avatar: finalAvatar,
        }),
      );
      setAvatar(finalAvatar?.url || "");
      setAvatarFile(null);
      setFormData((prev) => ({ ...prev, password: "" }));
      showToast("تم حفظ التغييرات بنجاح");
    } catch (err) {
      showToast(err.message || "حدث خطأ أثناء التحديث", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل حذف الحساب");
      dispatch(signOut());
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (err) {
      showToast(err.message || "حدث خطأ أثناء حذف الحساب", "error");
    }
  };

  const confirmDeleteListing = async () => {
    if (!listingToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/listing/${listingToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل حذف العقار");
      setUserListings((prev) =>
        prev.filter((item) => item._id !== listingToDelete._id),
      );
      setListingToDelete(null);
      showToast("تم حذف العقار بنجاح");
    } catch (err) {
      showToast(err.message || "حدث خطأ أثناء حذف العقار", "error");
    }
  };

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (formData.username.trim()) score += 25;
    if (formData.email.trim()) score += 25;
    if (formData.phone.trim()) score += 20;
    if (avatar) score += 20;
    if (currentUser?.isVerified) score += 10;
    return Math.min(100, score);
  }, [
    avatar,
    currentUser?.isVerified,
    formData.email,
    formData.phone,
    formData.username,
  ]);

  const stats = useMemo(
    () => [
      { label: "إجمالي العقارات", value: userListings.length, icon: Building2 },
      {
        label: "عقارات للبيع",
        value: userListings.filter((listing) => listing.type === "sell").length,
        icon: Home,
      },
      {
        label: "عقارات للإيجار",
        value: userListings.filter((listing) => listing.type === "rent").length,
        icon: Sparkles,
      },
      {
        label: "حالة الحساب",
        value: currentUser?.isVerified ? "موثّق" : "قيد المراجعة",
        icon: ShieldCheck,
      },
    ],
    [currentUser?.isVerified, userListings],
  );

  const avatarSrc =
    typeof avatar === "string" && avatar
      ? avatar
      : avatar?.url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.username || "User",
        )}&background=183d37&color=fee0c4&size=160`;

  if (!currentUser) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-4"
        dir="rtl"
      >
        <div className="rounded-3xl border border-[#e7e2d7] bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-lg font-bold text-[#183d37]">
            لم تقم بتسجيل الدخول بعد.
          </p>
          <Link
            to="/signin"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#e49263] px-6 py-2.5 text-sm font-extrabold text-[#173d36] transition hover:bg-[#f1b68b]"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] pb-16" dir="rtl">
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 top-5 z-50 flex min-w-[280px] -translate-x-1/2 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg backdrop-blur ${
              toast.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : toast.type === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {toast.type === "error" ? (
              <AlertTriangle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        {/* Cover + identity card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-[32px] border border-[#e7e2d7] bg-white shadow-[0_28px_80px_-30px_rgba(15,38,34,0.28)]"
        >
          <div className="relative h-40 overflow-hidden bg-[#183d37] sm:h-48">
            <div className="absolute -left-16 bottom-0 size-64 rounded-full bg-[#e2a87b]/20 blur-3xl" />
            <div className="absolute right-[15%] -top-10 size-48 rounded-full border border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f2622]/30 via-transparent to-[#183d37]" />
          </div>

          <div className="relative px-6 pb-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative -mt-14 shrink-0 sm:-mt-16">
                  <img
                    src={avatarSrc}
                    alt={formData.username || "المستخدم"}
                    className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-xl sm:h-32 sm:w-32"
                  />
                  <label className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#e49263] text-[#173d36] shadow-lg transition hover:scale-105 hover:bg-[#f1b68b]">
                    <Camera size={16} />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black text-[#183d37] sm:text-3xl">
                      {formData.username || currentUser?.username || "مستخدم"}
                    </h1>
                    {currentUser?.isVerified ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={13} /> موثّق
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                        <ShieldCheck size={13} /> قيد المراجعة
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#6b7d76]">
                    {formData.email || currentUser?.email || "your@email.com"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full border border-[#183d37]/10 bg-[#183d37]/5 px-3 py-1 text-[#183d37]">
                      عضو منذ{" "}
                      {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString(
                            "ar-EG",
                            { month: "short", year: "numeric" },
                          )
                        : "وقت قريب"}
                    </span>
                    {formData.phone && (
                      <span className="flex items-center gap-1.5 rounded-full border border-[#183d37]/10 bg-[#183d37]/5 px-3 py-1 text-[#183d37]">
                        <Phone size={12} /> {formData.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#183d37]/10 bg-[#183d37]/5 px-4 py-3 text-center sm:text-right">
                <p className="text-xs font-bold text-[#6b7d76]">عدد العقارات</p>
                <p className="text-2xl font-black text-[#183d37]">
                  {userListings.length}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {/* Profile completion */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[28px] border border-[#e7e2d7] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#a08a5f]">
                    اكتمال الملف
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#183d37]">
                    أكمل ملفك الشخصي
                  </h2>
                </div>
                <div className="rounded-2xl bg-[#183d37] px-3 py-2 text-sm font-black text-[#f1b184]">
                  {profileCompletion}%
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#f1efe8]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#e49263] to-[#e8c56d]"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6b7d76]">
                أكمل بياناتك لإظهار ملف شخصي احترافي وزيادة ثقة العملاء عند عرض
                العقارات.
              </p>
            </motion.section>

            {/* Account information */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] border border-[#e7e2d7] bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#a08a5f]">
                    بيانات الحساب
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#183d37]">
                    معلومات الحساب
                  </h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#e8c56d]/20 px-3 py-1 text-xs font-bold text-[#a08a5f]">
                  <Sparkles size={14} />
                  عضوية مميزة
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-bold text-[#183d37]"
                  >
                    اسم المستخدم
                  </label>
                  <input
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e7e2d7] bg-[#faf9f6] px-4 py-3 text-sm font-semibold text-[#183d37] outline-none transition focus:border-[#e49263] focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-[#183d37]"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#e7e2d7] bg-[#faf9f6] px-4 py-3 text-sm font-semibold text-[#183d37] outline-none transition focus:border-[#e49263] focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-[#183d37]"
                  >
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#a9beb5]"
                    />
                    <input
                      id="phone"
                      type="tel"
                      dir="ltr"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01xxxxxxxxx"
                      className="w-full rounded-2xl border border-[#e7e2d7] bg-[#faf9f6] py-3 pl-4 pr-11 text-left text-sm font-semibold text-[#183d37] outline-none transition focus:border-[#e49263] focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#183d37]"
                  >
                    كلمة المرور
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="اتركها فارغة إذا لم ترغب بتغييرها"
                    className="w-full rounded-2xl border border-[#e7e2d7] bg-[#faf9f6] px-4 py-3 text-sm font-semibold text-[#183d37] outline-none transition focus:border-[#e49263] focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e49263] px-5 py-3 text-sm font-extrabold text-[#173d36] shadow-lg shadow-[#e49263]/20 transition hover:translate-y-[-1px] hover:bg-[#f1b68b] disabled:opacity-70"
                >
                  {loading ? (
                    <Upload size={16} className="animate-pulse" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e7e2d7] bg-white px-5 py-3 text-sm font-extrabold text-[#183d37] transition hover:bg-[#f7f5f0]"
                >
                  <LogOut size={18} />
                  تسجيل الخروج
                </button>
              </div>
            </motion.section>

            {/* Danger zone — delete account */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-[28px] border border-red-200 bg-red-50/50 p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-red-700">
                    منطقة الخطر
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-red-700/80">
                    حذف حسابك إجراء نهائي، وسيؤدي إلى فقدان بياناتك وعقاراتك
                    المنشورة بشكل كامل ولا يمكن التراجع عنه.
                  </p>
                  <button
                    onClick={() => setShowDeleteAccount(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                    حذف الحساب نهائيًا
                  </button>
                </div>
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.04 }}
                    className="rounded-[24px] border border-[#e7e2d7] bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#6b7d76]">
                        {item.label}
                      </p>
                      <div className="rounded-2xl bg-[#183d37]/5 p-2 text-[#183d37]">
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-black text-[#183d37]">
                      {item.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-[28px] border border-[#e7e2d7] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#a08a5f]">
                    عقاراتي
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#183d37]">
                    العقارات الخاصة بي
                  </h2>
                </div>
                <Link
                  to="/create-listing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#183d37] px-4 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:translate-y-[-1px] hover:bg-[#0f2622]"
                >
                  <Plus size={16} />
                  إنشاء عقار
                </Link>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowListings((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e7e2d7] bg-[#faf9f6] px-4 py-2 text-sm font-bold text-[#183d37] transition hover:bg-[#f1efe8]"
                >
                  {showListings ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                  {showListings ? "إخفاء العقارات" : "مشاهدة عقاراتي"}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {showListings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 space-y-4">
                      {listingsLoading ? (
                        <div className="space-y-3">
                          {[1, 2].map((item) => (
                            <div
                              key={item}
                              className="animate-pulse rounded-3xl border border-[#e7e2d7] p-4"
                            >
                              <div className="h-24 rounded-2xl bg-[#f1efe8]" />
                              <div className="mt-3 h-4 w-1/3 rounded bg-[#f1efe8]" />
                              <div className="mt-2 h-4 w-2/3 rounded bg-[#f1efe8]" />
                            </div>
                          ))}
                        </div>
                      ) : userListings.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-[#e7e2d7] bg-[#faf9f6] p-8 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <Home size={24} className="text-[#183d37]" />
                          </div>
                          <h3 className="mt-4 text-lg font-black text-[#183d37]">
                            لا توجد عقارات حتى الآن
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-[#6b7d76]">
                            ابدأ بإضافة أول عقار لك وابدأ في عرض مشروعاتك بشكل
                            احترافي.
                          </p>
                          <Link
                            to="/create-listing"
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#183d37] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0f2622]"
                          >
                            <Plus size={16} />
                            إضافة عقار جديد
                          </Link>
                        </div>
                      ) : (
                        userListings.map((listing) => (
                          <motion.article
                            key={listing._id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-[24px] border border-[#e7e2d7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                          >
                            <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr]">
                              <div className="relative h-40 overflow-hidden rounded-[20px]">
                                <Link
                                  to={`/listing/${listing._id}`}
                                  className="absolute inset-0"
                                >
                                  <img
                                    src={
                                      listing.imageUrl?.[0]?.url ||
                                      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80"
                                    }
                                    alt={listing.name}
                                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                  />
                                </Link>
                              </div>
                              <div className="flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-2 text-lg font-black text-[#183d37]">
                                    <Link
                                      to={`/listing/${listing._id}`}
                                      className="hover:underline"
                                    >
                                      {listing.name}
                                    </Link>
                                    <Eye size={16} className="text-[#a9beb5]" />
                                  </div>
                                  <p className="mt-2 text-sm leading-7 text-[#6b7d76]">
                                    {listing.address}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[#183d37]/5 px-3 py-1 text-xs font-bold text-[#183d37]">
                                      {listing.type === "sell"
                                        ? "للبيع"
                                        : "للايجار"}
                                    </span>
                                    <span className="flex items-center gap-1 rounded-full bg-[#183d37]/5 px-3 py-1 text-xs font-bold text-[#183d37]">
                                      <BedDouble size={12} />
                                      {listing.bedrooms || 0} غرف
                                    </span>
                                    <span className="flex items-center gap-1 rounded-full bg-[#183d37]/5 px-3 py-1 text-xs font-bold text-[#183d37]">
                                      <Bath size={12} />
                                      {listing.bathrooms || 0} حمامات
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 text-lg font-black text-[#183d37]">
                                    <DollarSign
                                      size={18}
                                      className="text-[#e49263]"
                                    />
                                    {listing.price?.toLocaleString("ar-EG")} ج.م
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/create-listing?edit=${listing._id}`,
                                        )
                                      }
                                      className="inline-flex items-center gap-2 rounded-2xl border border-[#e7e2d7] bg-white px-3 py-2 text-sm font-bold text-[#183d37] transition hover:border-[#e49263] hover:bg-[#faf9f6]"
                                    >
                                      <Pencil size={15} />
                                      تعديل
                                    </button>
                                    <button
                                      onClick={() =>
                                        setListingToDelete(listing)
                                      }
                                      className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                                    >
                                      <Trash2 size={15} />
                                      حذف
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Delete listing confirmation */}
      <AnimatePresence>
        {listingToDelete && (
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
              className="w-full max-w-md rounded-[28px] border border-[#e7e2d7] bg-white p-6 shadow-2xl"
              dir="rtl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#183d37]">
                    حذف العقار
                  </h3>
                  <p className="text-sm font-semibold text-[#6b7d76]">
                    لن تتمكن من استرجاعه بعد الحذف
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#6b7d76]">
                هل أنت متأكد من حذف هذا العقار؟
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setListingToDelete(null)}
                  className="rounded-2xl border border-[#e7e2d7] px-4 py-2.5 text-sm font-bold text-[#183d37] transition hover:bg-[#faf9f6]"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDeleteListing}
                  className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete account confirmation */}
      <AnimatePresence>
        {showDeleteAccount && (
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
              className="w-full max-w-md rounded-[28px] border border-[#e7e2d7] bg-white p-6 shadow-2xl"
              dir="rtl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#183d37]">
                    حذف الحساب نهائيًا
                  </h3>
                  <p className="text-sm font-semibold text-[#6b7d76]">
                    هذا الإجراء لا يمكن التراجع عنه
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#6b7d76]">
                سيتم حذف حسابك وكل عقاراتك المنشورة بشكل نهائي. هل أنت متأكد من
                المتابعة؟
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setShowDeleteAccount(false)}
                  className="rounded-2xl border border-[#e7e2d7] px-4 py-2.5 text-sm font-bold text-[#183d37] transition hover:bg-[#faf9f6]"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <Trash2 size={15} />
                  حذف الحساب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
