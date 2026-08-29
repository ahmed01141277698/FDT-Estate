import { useMemo, useState } from "react";
import { ArrowLeft, FileText, Send, UploadCloud } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { submitCareerApplication } from "../services/contentService";

const initialState = {
  applicantName: "",
  email: "",
  phone: "",
  linkedInUrl: "",
  portfolioUrl: "",
  coverLetter: "",
};

export default function CareerApplicationPage() {
  const { slug } = useParams();
  const [form, setForm] = useState(initialState);
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCvValid = useMemo(() => {
    if (!cv) return false;
    const allowedTypes = ["application/pdf"];
    const maxSizeBytes = 2 * 1024 * 1024;
    return allowedTypes.includes(cv.type) && cv.size <= maxSizeBytes;
  }, [cv]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!cv || !isCvValid) {
      setError("يرجى إرفاق ملف CV بصيغة PDF وبحجم أقصى 2MB.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("cv", cv);

    try {
      setSubmitting(true);
      await submitCareerApplication(slug, formData);
      setSuccess("تم استلام طلبك بنجاح. سنراجع ملفك خلال أقرب وقت ممكن.");
      setForm(initialState);
      setCv(null);
    } catch (err) {
      setError(err.message || "تعذر إرسال الطلب.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#183d37]" dir="rtl">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#3c5b57]">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <Link to="/careers">الوظائف</Link>
          <span>/</span>
          <span className="text-[#183d37]">التقديم</span>
        </nav>

        <div className="rounded-[30px] border border-[#d9d0bf] bg-white p-5 shadow-[0_22px_60px_rgba(24,61,55,0.08)] sm:p-8">
          <div className="mb-7 flex items-center justify-between gap-3 border-b border-[#efe9df] pb-5">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#6b7d7b] uppercase">
                Application
              </p>
              <h1 className="text-3xl font-black text-[#183d37]">
                تقديم طلب الوظيفة
              </h1>
            </div>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9d0bf] bg-[#fbfaf8] px-3 py-2 text-sm font-bold text-[#183d37]"
            >
              العودة للوظائف
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <label className="md:col-span-1">
              <span className="mb-2 block text-sm font-bold text-[#183d37]">
                الاسم الكامل
              </span>
              <input
                required
                name="applicantName"
                value={form.applicantName}
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
                رقم الهاتف
              </span>
              <input
                required
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
              />
            </label>

            <label className="md:col-span-1">
              <span className="mb-2 block text-sm font-bold text-[#183d37]">
                LinkedIn URL
              </span>
              <input
                name="linkedInUrl"
                type="url"
                value={form.linkedInUrl}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#183d37]">
                Portfolio URL
              </span>
              <input
                name="portfolioUrl"
                type="url"
                value={form.portfolioUrl}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
                placeholder="https://your-portfolio.com"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#183d37]">
                خطاب التقديم
              </span>
              <textarea
                required
                rows={6}
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-4 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#183d37]">
                السيرة الذاتية (PDF فقط)
              </span>
              <div
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed px-4 py-4 ${cv && isCvValid ? "border-[#3aa68d] bg-[#edfaf6]" : "border-[#d9d0bf] bg-[#faf9f6]"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f4] text-[#183d37]">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#183d37]">
                      {cv ? cv.name : "اختر ملف PDF"}
                    </p>
                    <p className="text-xs text-[#4a615d]">بحد أقصى 2MB</p>
                  </div>
                </div>
                <FileText className="h-5 w-5 text-[#c9a227]" />
              </div>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => setCv(event.target.files?.[0] || null)}
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
              disabled={submitting}
              type="submit"
              className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#183d37] px-5 py-3 text-sm font-black text-white transition hover:bg-[#224a45] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "جارِ الإرسال..." : "إرسال الطلب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
