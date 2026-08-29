import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublishedJobs } from "../services/contentService";

const EMPTY_STATE = {
  jobs: [],
  pagination: { page: 1, totalPages: 1, total: 0 },
};

export default function CareersPage() {
  const [jobs, setJobs] = useState(EMPTY_STATE.jobs);
  const [pagination, setPagination] = useState(EMPTY_STATE.pagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
  });

  useEffect(() => {
    let alive = true;

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        const payload = await fetchPublishedJobs({
          page: 1,
          limit: 12,
          search: filters.search,
          department: filters.department,
          location: filters.location,
          employmentType: filters.employmentType,
          experienceLevel: filters.experienceLevel,
        });

        if (!alive) return;
        setJobs(payload.data?.jobs || payload.jobs || []);
        setPagination(
          payload.data?.pagination ||
            payload.pagination || { page: 1, totalPages: 1, total: 0 },
        );
      } catch (err) {
        if (!alive) return;
        setError(err.message || "تعذر تحميل الوظائف في الوقت الحالي.");
        setJobs([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadJobs();
    return () => {
      alive = false;
    };
  }, [
    filters.search,
    filters.department,
    filters.location,
    filters.employmentType,
    filters.experienceLevel,
  ]);

  const departments = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.department).filter(Boolean))),
    [jobs],
  );
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.location).filter(Boolean))),
    [jobs],
  );

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#183d37]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[30px] border border-[#d9d0bf] bg-[#183d37] p-6 text-white shadow-[0_22px_60px_rgba(24,61,55,0.18)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#e8c56d] uppercase">
                Aqarx Careers
              </p>
              <h1 className="text-3xl font-black sm:text-5xl">
                ابنِ المستقبل معنا
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-[#dfe9e7] sm:text-base">
                نبحث عن أشخاص يشاركوننا الرؤية في بناء تجربة عقارية أكثر شفافية،
                ثقة، وذكاءً في خدمة المستهلكين.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              العودة إلى الرئيسية
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "بيئة عمل احترافية", icon: Sparkles },
            { label: "التعلم والتطوير", icon: BriefcaseBusiness },
            { label: "عمل على منتجات حقيقية", icon: SlidersHorizontal },
            { label: "ثقافة الفريق", icon: Search },
            { label: "فرص النمو", icon: MapPin },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="rounded-[22px] border border-[#d9d0bf] bg-white p-4 shadow-[0_12px_30px_rgba(17,24,39,0.04)]"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f4] text-[#183d37]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-[#183d37]">{label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] border border-[#d9d0bf] bg-white p-4 shadow-[0_18px_40px_rgba(17,24,39,0.05)] sm:p-6">
          <div className="mb-4 grid gap-3 lg:grid-cols-5">
            <label className="relative col-span-2 lg:col-span-2">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64817d]" />
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                placeholder="ابحث عن الوظيفة أو القسم…"
                className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-12 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
              />
            </label>

            <select
              value={filters.department}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  department: event.target.value,
                }))
              }
              className="rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-3 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
            >
              <option value="">كل الأقسام</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={filters.location}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              className="rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-3 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
            >
              <option value="">كل المواقع</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              value={filters.employmentType}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  employmentType: event.target.value,
                }))
              }
              className="rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-3 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
            >
              <option value="">كل أنواع العمل</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#efe9df] pb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#6b7d7b] uppercase">
                Open Positions
              </p>
              <h2 className="text-2xl font-black text-[#183d37]">
                الفرص الحالية
              </h2>
            </div>
            <span className="rounded-full bg-[#f4efe5] px-3 py-1.5 text-xs font-bold text-[#183d37]">
              {pagination.total || jobs.length} فرصة
            </span>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[26px] border border-[#ebeadf] bg-[#f8f6f2] p-5"
                >
                  <div className="mb-4 h-4 w-24 rounded-full bg-[#e8e0d5]" />
                  <div className="mb-2 h-6 w-3/4 rounded bg-[#e8e0d5]" />
                  <div className="mb-5 h-4 w-full rounded bg-[#e8e0d5]" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/2 rounded bg-[#e8e0d5]" />
                    <div className="h-3 w-2/3 rounded bg-[#e8e0d5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[24px] border border-dashed border-[#d4bd8d] bg-[#fffdf9] p-8 text-center">
              <p className="text-lg font-bold text-[#183d37]">
                تعذر تحميل الفرص في الوقت الحالي
              </p>
              <p className="mt-2 text-sm text-[#4a615d]">{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#d4bd8d] bg-[#fffdf9] p-8 text-center">
              <p className="text-lg font-bold text-[#183d37]">
                لا توجد وظائف متاحة حاليًا
              </p>
              <p className="mt-2 text-sm text-[#4a615d]">
                حاول تغيير الفلاتر أو عد إلى وقت لاحق.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <article
                  key={job._id}
                  className="rounded-[26px] border border-[#d9d0bf] bg-[#fffdfb] p-5 shadow-[0_12px_36px_rgba(17,24,39,.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(17,24,39,.08)]"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#edf6f4] px-2.5 py-1 text-[11px] font-bold text-[#183d37]">
                      {job.department}
                    </span>
                    {job.isFeatured && (
                      <span className="rounded-full bg-[#fff5d9] px-2.5 py-1 text-[11px] font-bold text-[#9a6b18]">
                        مميزة
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-[#183d37]">
                    {job.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#4d6965]">
                    {job.description?.slice(0, 130)}...
                  </p>

                  <div className="mt-5 grid gap-2 text-sm text-[#385a56]">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#c9a227]" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-[#c9a227]" />
                      {job.employmentType}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#efe9df] pt-4">
                    <div className="text-xs text-[#6b7d7b]">
                      {job.experienceLevel}
                    </div>
                    <Link
                      to={`/careers/${job.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#183d37] px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#224a45]"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
