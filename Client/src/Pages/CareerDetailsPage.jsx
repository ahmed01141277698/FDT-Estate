import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Sparkles,
  Building2,
  CalendarRange,
  CheckCircle2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { fetchCareerBySlug } from "../services/contentService";

export default function CareerDetailsPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadJob() {
      setLoading(true);
      setError("");

      try {
        const payload = await fetchCareerBySlug(slug);
        if (!alive) return;
        setJob(payload.data?.job || payload.job || null);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "تعذر تحميل تفاصيل الوظيفة.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (slug) loadJob();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#f5f1ea] px-4 py-28 text-[#183d37]"
        dir="rtl"
      >
        <div className="mx-auto max-w-5xl animate-pulse rounded-[30px] border border-[#e8e0d5] bg-white p-8">
          <div className="mb-6 h-5 w-32 rounded-full bg-[#ece3d3]" />
          <div className="mb-4 h-10 w-2/3 rounded bg-[#ece3d3]" />
          <div className="mt-6 h-4 w-full rounded bg-[#ece3d3]" />
          <div className="mt-3 h-4 w-5/6 rounded bg-[#ece3d3]" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div
        className="min-h-screen bg-[#f5f1ea] px-4 py-28 text-[#183d37]"
        dir="rtl"
      >
        <div className="mx-auto max-w-3xl rounded-[30px] border border-dashed border-[#d4bd8d] bg-[#fffdf9] p-8 text-center">
          <h1 className="text-2xl font-black">تعذر العثور على الوظيفة</h1>
          <p className="mt-2 text-sm text-[#4a615d]">
            {error || "الوظيفة المطلوبة غير موجودة أو غير منشورة."}
          </p>
          <Link
            to="/careers"
            className="mt-6 inline-flex items-center rounded-full bg-[#183d37] px-4 py-2.5 text-sm font-bold text-white"
          >
            العودة إلى الوظائف
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#183d37]" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#3c5b57]">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <Link to="/careers">الوظائف</Link>
          <span>/</span>
          <span className="text-[#183d37]">{job.title}</span>
        </nav>

        <div className="overflow-hidden rounded-[30px] border border-[#d9d0bf] bg-white shadow-[0_22px_60px_rgba(24,61,55,0.08)]">
          <div className="border-b border-[#efe9df] bg-[#183d37] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-[#e8c56d] uppercase">
                  {job.department}
                </p>
                <h1 className="text-3xl font-black sm:text-4xl">{job.title}</h1>
              </div>
              <Link
                to={`/careers/${job.slug}/apply`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8c56d] px-5 py-3 text-sm font-black text-[#183d37] transition hover:bg-[#f1d378]"
              >
                التقديم الآن
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-xl font-black text-[#183d37]">
                  الوصف
                </h2>
                <p className="text-[15px] leading-8 text-[#385a56]">
                  {job.description}
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-black text-[#183d37]">
                  المسؤوليات
                </h2>
                <ul className="space-y-3">
                  {(job.responsibilities || []).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-8 text-[#385a56]"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1e7d67]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-black text-[#183d37]">
                  المتطلبات
                </h2>
                <ul className="space-y-3">
                  {(job.requirements || []).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-8 text-[#385a56]"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#c9a227]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {job.benefits?.length ? (
                <section>
                  <h2 className="mb-3 text-xl font-black text-[#183d37]">
                    الفوائد
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="rounded-full border border-[#d9d0bf] bg-[#fffdf8] px-3 py-1.5 text-sm text-[#183d37]"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="rounded-[26px] border border-[#d9d0bf] bg-[#fbfaf8] p-5">
              <h3 className="mb-4 text-lg font-black text-[#183d37]">
                معلومات الوظيفة
              </h3>
              <div className="space-y-3 text-sm text-[#385a56]">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-[#c9a227]" />
                  {job.department}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#c9a227]" />
                  {job.location}
                </div>
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness className="h-4 w-4 text-[#c9a227]" />
                  {job.employmentType}
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-[#c9a227]" />
                  {job.experienceLevel}
                </div>
                {job.applicationDeadline && (
                  <div className="flex items-center gap-3">
                    <CalendarRange className="h-4 w-4 text-[#c9a227]" />
                    آخر موعد للتقديم:{" "}
                    {new Date(job.applicationDeadline).toLocaleDateString(
                      "ar-EG",
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-[#c9a227]" />
                  {job.workMode}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#efe9df] bg-white p-4">
                <p className="text-sm text-[#4d6965]">مستوى الراتب</p>
                <p className="mt-1 text-lg font-black text-[#183d37]">
                  {job.salary?.min && job.salary?.max
                    ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency || "EGP"}`
                    : "يُحدد لاحقًا"}
                </p>
              </div>

              <Link
                to={`/careers/${job.slug}/apply`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#183d37] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#224a45]"
              >
                التقديم الآن
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
