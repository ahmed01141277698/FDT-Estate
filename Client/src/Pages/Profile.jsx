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
  Pencil,
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
    password: "",
  });
  const [avatar, setAvatar] = useState(currentUser?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    setAvatar(currentUser?.avatar || null);
    setFormData({
      username: currentUser?.username || "",
      email: currentUser?.email || "",
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
      let uploadedAvatarUrl = currentUser?.avatar || avatar;

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
        uploadedAvatarUrl = uploadData.url;
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          ...(formData.password && { password: formData.password }),
          ...(uploadedAvatarUrl && { avatar: uploadedAvatarUrl }),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث البيانات");

      const updatedUser = data.user || data;
      dispatch(
        updateUserSuccess({
          ...currentUser,
          ...updatedUser,
          avatar:
            updatedUser.avatar || uploadedAvatarUrl || currentUser?.avatar,
        }),
      );
      setAvatar(updatedUser.avatar || uploadedAvatarUrl || currentUser?.avatar);
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
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
    );
    if (!confirmed) return;

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
    if (formData.username.trim()) score += 35;
    if (formData.email.trim()) score += 35;
    if (avatar) score += 20;
    if (currentUser?.isVerified) score += 10;
    return Math.min(100, score);
  }, [avatar, currentUser?.isVerified, formData.email, formData.username]);

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
        value: currentUser?.isVerified ? "موثق" : "قيد المراجعة",
        icon: ShieldCheck,
      },
    ],
    [currentUser?.isVerified, userListings],
  );

  const avatarSrc =
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formData.username || "User",
    )}&background=3b82f6&color=fff&size=160`;

  if (!currentUser) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
        dir="rtl"
      >
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">
            لم تقم بتسجيل الدخول بعد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16" dir="rtl">
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 top-5 z-50 flex min-w-[280px] -translate-x-1/2 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur ${
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_80px_-30px_rgba(15,23,42,0.24)]"
        >
          <div className="relative h-64 overflow-hidden md:h-80">
            <img
              src={avatarSrc}
              alt="cover"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="relative">
                  <img
                    src={avatarSrc}
                    alt={formData.username || "المستخدم"}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-2xl md:h-32 md:w-32"
                  />
                  <label className="absolute bottom-1 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700">
                    <Camera size={18} />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold md:text-3xl">
                      {formData.username || currentUser?.username || "مستخدم"}
                    </h1>
                    {currentUser?.isVerified ? (
                      <CheckCircle2 size={20} className="text-emerald-400" />
                    ) : (
                      <ShieldCheck size={20} className="text-slate-300" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-200">
                    {formData.email || currentUser?.email || "your@email.com"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-slate-100">
                      Verified Member
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-slate-100">
                      Joined{" "}
                      {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString(
                            "ar-EG",
                            { month: "short", year: "numeric" },
                          )
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-sm text-slate-200">عدد العقارات</p>
                <p className="text-2xl font-semibold text-white">
                  {userListings.length}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Profile Completion
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-800">
                    اكمل ملفك الشخصي
                  </h2>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {profileCompletion}%
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                أكمل بياناتك لإظهار ملف شخصي احترافي وزيادة ثقة العملاء عند عرض
                العقارات.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Account Information
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-800">
                    معلومات الحساب
                  </h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                  <Sparkles size={16} />
                  Premium Ready
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-slate-600"
                  >
                    اسم المستخدم
                  </label>
                  <input
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-600"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-600"
                  >
                    كلمة المرور
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="اتركها فارغة إذا لم ترغب بتغييرها"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-70"
                >
                  {loading ? (
                    <Upload size={16} className="animate-pulse" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-slate-50"
                >
                  <Camera size={16} />
                  تغيير الصورة
                </button>
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
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {item.label}
                      </p>
                      <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-slate-800">
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
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    My Properties
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-800">
                    العقارات الخاصة بي
                  </h2>
                </div>
                <Link
                  to="/create-listing"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
                >
                  <Plus size={16} />
                  إنشاء عقار
                </Link>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowListings((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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
                              className="animate-pulse rounded-3xl border border-slate-200 p-4"
                            >
                              <div className="h-24 rounded-2xl bg-slate-100" />
                              <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
                              <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                            </div>
                          ))}
                        </div>
                      ) : userListings.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <Home size={24} className="text-slate-500" />
                          </div>
                          <h3 className="mt-4 text-lg font-semibold text-slate-800">
                            لا توجد عقارات حتى الآن
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-500">
                            ابدأ بإضافة أول عقار لك وابدأ في عرض مشروعاتك بشكل
                            احترافي.
                          </p>
                          <Link
                            to="/create-listing"
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
                            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                          >
                            <div className="grid gap-4 p-4 md:grid-cols-[180px_1fr]">
                              <div className="relative h-40 overflow-hidden rounded-[20px]">
                                <img
                                  src={
                                    listing.imageUrl?.[0]?.url ||
                                    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80"
                                  }
                                  alt={listing.name}
                                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                />
                              </div>
                              <div className="flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                    {listing.name}
                                    <Eye size={16} className="text-slate-400" />
                                  </div>
                                  <p className="mt-2 text-sm leading-7 text-slate-500">
                                    {listing.address}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                      {listing.type === "sell"
                                        ? "للبيع"
                                        : "للايجار"}
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                      {listing.bedrooms || 0} غرف
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                      {listing.bathrooms || 0} حمامات
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                                    <DollarSign
                                      size={18}
                                      className="text-emerald-600"
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
                                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-slate-50"
                                    >
                                      <Pencil size={15} />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        setListingToDelete(listing)
                                      }
                                      className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                    >
                                      <Trash2 size={15} />
                                      Delete
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

      <AnimatePresence>
        {listingToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    حذف العقار
                  </h3>
                  <p className="text-sm text-slate-500">
                    لن تتمكن من استرجاعه بعد الحذف
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                هل أنت متأكد من حذف هذا العقار؟
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setListingToDelete(null)}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDeleteListing}
                  className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  حذف
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
