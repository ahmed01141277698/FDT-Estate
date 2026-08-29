import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { submitContactMessage } from "../services/contentService";

const categories = [
  { value: "general_inquiry", label: "استفسار عام" },
  { value: "technical_support", label: "الدعم الفني" },
  { value: "property_issue", label: "مشكلة عقار" },
  { value: "partnership", label: "شراكة" },
  { value: "business_inquiry", label: "استفسار تجاري" },
  { value: "report_problem", label: "الإبلاغ عن مشكلة" },
  { value: "careers", label: "الوظائف" },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  category: "general_inquiry",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.message.trim().length < 20) {
      setError("الرسالة يجب أن تكون 20 حرفًا على الأقل.");
      return;
    }

    try {
      setSubmitting(true);
      await submitContactMessage(form);
      setSuccess("تم استلام رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن.");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "تعذر إرسال الرسالة.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#183d37]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-[30px] border border-[#d9d0bf] bg-[#183d37] text-white shadow-[0_22px_60px_rgba(24,61,55,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#e8c56d] uppercase">
                Contact Us
              </p>
              <h1 className="text-3xl font-black sm:text-5xl">
                تواصل مع Aqarx
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-8 text-[#dfe9e7] sm:text-base">
                نحن هنا للإجابة على استفساراتك، حل مشكلاتك، ومساعدة فريقنا على
                تقديم تجربة أفضل لك في منصة العقارات.
              </p>
            </div>
            <div className="flex items-center justify-center bg-gradient-to-br from-[#224a45] to-[#183d37] p-6">
              <div className="rounded-[26px] border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm text-[#dfe9e7]">البريد الإلكتروني</p>
                <a
                  href="mailto:ahmedalfaod230@gmail.com"
                  className="mt-2 block text-lg font-black text-white"
                >
                  ahmedalfaod230@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-4">
            {[
              {
                title: "استفسار عام",
                icon: MessageSquareText,
                text: "لأسئلة حول المنصة والخدمات والعمليات.",
              },
              {
                title: "الدعم الفني",
                icon: ShieldCheck,
                text: "للمشكلات التقنية أو أخطاء التطبيق.",
              },
              {
                title: "الوظائف",
                icon: Mail,
                text: "للاستفسار عن فرص العمل أو التقديم.",
              },
            ].map(({ title, icon: Icon, text }) => (
              <div
                key={title}
                className="rounded-[24px] border border-[#d9d0bf] bg-white p-5 shadow-[0_12px_36px_rgba(17,24,39,.04)]"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f4] text-[#183d37]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-[#183d37]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#4d6965]">{text}</p>
              </div>
            ))}
          </aside>

          <div className="rounded-[28px] border border-[#d9d0bf] bg-white p-5 shadow-[0_18px_40px_rgba(17,24,39,.05)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#efe9df] pb-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#6b7d7b] uppercase">
                  Message
                </p>
                <h2 className="text-2xl font-black text-[#183d37]">
                  إرسال رسالة
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#f4efe5] px-3 py-1.5 text-xs font-bold text-[#183d37]">
                <Phone className="h-3.5 w-3.5" />
                سريع الاستجابة
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-1">
                <span className="mb-2 block text-sm font-bold text-[#183d37]">
                  الاسم
                </span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                />
              </label>

              <label className="md:col-span-1">
                <span className="mb-2 block text-sm font-bold text-[#183d37]">
                  البريد الإلكتروني
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                />
              </label>

              <label className="md:col-span-1">
                <span className="mb-2 block text-sm font-bold text-[#183d37]">
                  رقم الهاتف (اختياري)
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                />
              </label>

              <label className="md:col-span-1">
                <span className="mb-2 block text-sm font-bold text-[#183d37]">
                  الموضوع
                </span>
                <input
                  required
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#183d37]">
                  الفئة
                </span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-[#183d37]">
                  الرسالة
                </span>
                <textarea
                  required
                  rows={7}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                />
              </label>

              {error && (
                <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#183d37] px-5 py-3 text-sm font-black text-white transition hover:bg-[#224a45] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? "جارِ الإرسال..." : "إرسال الرسالة"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
