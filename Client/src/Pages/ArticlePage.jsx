import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Share2,
  Tag,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleBySlug } from "../services/contentService";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadArticle() {
      try {
        setLoading(true);
        const payload = await fetchArticleBySlug(slug);
        if (!alive) return;
        setArticle(payload.data?.article || payload.article || null);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "تعذر تحميل المقال.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (slug) loadArticle();
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
          <div className="mb-4 h-7 w-24 rounded-full bg-[#ece3d3]" />
          <div className="mb-4 h-12 w-2/3 rounded bg-[#ece3d3]" />
          <div className="h-80 rounded-[24px] bg-[#ece3d3]" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div
        className="min-h-screen bg-[#f5f1ea] px-4 py-28 text-[#183d37]"
        dir="rtl"
      >
        <div className="mx-auto max-w-3xl rounded-[30px] border border-dashed border-[#d4bd8d] bg-[#fffdf9] p-8 text-center">
          <h1 className="text-2xl font-black">المقال غير متاح</h1>
          <p className="mt-2 text-sm text-[#4a615d]">
            {error || "المقال المطلوب غير موجود أو غير منشور."}
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center rounded-full bg-[#183d37] px-4 py-2.5 text-sm font-bold text-white"
          >
            العودة إلى المدونة
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
          <Link to="/blog">المدونة</Link>
          <span>/</span>
          <span className="text-[#183d37]">{article.title}</span>
        </nav>

        <article className="overflow-hidden rounded-[30px] border border-[#d9d0bf] bg-white shadow-[0_22px_60px_rgba(24,61,55,0.08)]">
          <div
            className="h-72 w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${article.coverImage?.url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80"})`,
            }}
          />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-[#58706c]">
              <span className="rounded-full bg-[#edf6f4] px-3 py-1.5 font-bold text-[#183d37]">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5" />
                {article.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(
                  article.publishedAt || article.createdAt,
                ).toLocaleDateString("ar-EG")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {article.readingTime || "5 دقائق قراءة"}
              </span>
            </div>

            <h1 className="text-3xl font-black text-[#183d37] sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-9 text-[#4d6965]">
              {article.excerpt}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3 border-b border-[#efe9df] pb-5">
              <div className="flex items-center gap-3 text-sm text-[#385a56]">
                <UserRound className="h-4 w-4 text-[#c9a227]" />
                <span>{article.author}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9d0bf] bg-[#fbfaf8] px-3 py-2 text-sm font-bold text-[#183d37]"
              >
                <Share2 className="h-4 w-4" />
                مشاركة
              </button>
            </div>

            <div className="prose prose-lg mt-8 max-w-none text-[15px] leading-9 text-[#335551]">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {article.tags?.length ? (
              <div className="mt-10 border-t border-[#efe9df] pt-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#183d37]">
                  <Tag className="h-4 w-4 text-[#c9a227]" />
                  العلامات
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d9d0bf] bg-[#fffdf8] px-3 py-1.5 text-xs text-[#183d37]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}
