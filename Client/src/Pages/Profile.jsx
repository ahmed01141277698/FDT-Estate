import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";

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
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">لم تقم بتسجيل الدخول بعد.</p>
      </div>
    );
  }
  // ................................

  // .............................................
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("يرجى اختيار ملف صورة صالح", "error");
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
    formData.username.trim() !== currentUser.username ||
      formData.email.trim() !== currentUser.email ||
      formData.password ||
      avatarFile;
    if (!formData.username.trim() || !formData.email.trim()) {
      showToast("يرجى ملء الاسم والبريد الإلكتروني", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let uploadedAvatarUrl = currentUser.avatar;

      // Upload new avatar if selected
      // if (avatarFile) {
      //   const data = new FormData();
      //   data.append("avatar", avatarFile);
      //   const uploadRes = await fetch("/api/user/profile", {
      //     method: "POST",
      //     headers: { Authorization: `Bearer ${token}` },
      //     body: data,
      //   });
      //   if (!uploadRes.ok) throw new Error("فشل رفع الصورة");
      //   const uploadData = await uploadRes.json();
      //   uploadedAvatarUrl = uploadData.url;
      // }
      if (avatarFile) {
        const formDataImg = new FormData();
        formDataImg.append("avatar", avatarFile);
        const uploadRes = await fetch("/api/user/profile/avatar", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataImg,
        });
        if (!uploadRes.ok) throw new Error("فشل رفع الصورة");
        const uploadData = await uploadRes.json();
        uploadedAvatarUrl = uploadData.url;
      }
      // Update profile
      const body = {
        username: formData.username,
        email: formData.email,
        ...(uploadedAvatarUrl && { avatar: uploadedAvatarUrl }),
        ...(formData.password && { password: formData.password }),
      };

      const res = await fetch(`/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "فشل تحديث البيانات");
      }

      // Optionally update Redux store here with dispatch(updateUser(...))
      setFormData((prev) => ({ ...prev, password: "" }));
      setAvatarFile(null);
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
      const res = await fetch(`/api/user/profile`, {
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

  const avatarSrc =
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formData.username || "User",
    )}&background=3b82f6&color=fff&size=128`;

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-start justify-center pt-12 pb-16 px-4"
      dir="rtl"
    >
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all
            ${
              toast.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          الملف الشخصي
        </h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative w-24 h-24 rounded-full cursor-pointer group"
            onClick={() => fileRef.current.click()}
          >
            <img
              src={avatarSrc}
              alt={formData.username || "المستخدم"}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">اضغط على الصورة لتغييرها</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-gray-600 mb-1.5"
            >
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="أدخل اسم المستخدم"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-gray-50 text-right"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-gray-600 mb-1.5"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="أدخل البريد الإلكتروني"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-gray-50 text-right"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 mb-1.5"
            >
              كلمة مرور جديدة
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="اتركها فارغة إذا لم تريد التغيير"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-gray-50 text-right"
            />
            <p className="text-xs text-gray-400 mt-1">
              اتركها فارغة إذا لم تريد تغيير كلمة المرور
            </p>
          </div>

          {/* Update button */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                />
              </svg>
            )}
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200" />

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full h-10 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          تسجيل الخروج
        </button>

        {/* Delete account */}
        <button
          onClick={handleDeleteAccount}
          className="w-full h-10 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          حذف الحساب
        </button>
      </div>
    </div>
  );
};

export default Profile;
