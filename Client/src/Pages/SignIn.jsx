import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuth_Googal from "../Components/OAuth_Googal";
import {
  signInstart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setLocalError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      dispatch(signInstart());
      const response = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(signInFailure(data.message || "حدث خطأ أثناء تسجيل الدخول"));
        return;
      }

      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message || "فشل الاتصال بالخادم"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <p className="text-sm text-gray-500">مرحبا بك في</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            FDT<span className="text-yellow-500">Estate</span>
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            سجل دخولك للوصول إلى لوحة التحكم الخاصة بك
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-3xl shadow-sm ring-1 ring-black/5 divide-y divide-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  disabled={loading}
                  className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="mt-2 block w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "جارٍ الدخول..." : "دخول"}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-3 text-center text-sm text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          <span>أو</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <OAuth_Googal />

        {(localError || error) && (
          <p
            className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {localError || error}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link
            to="/signUp"
            className="font-semibold text-black underline-offset-4 hover:text-yellow-600"
          >
            سجل الآن
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
