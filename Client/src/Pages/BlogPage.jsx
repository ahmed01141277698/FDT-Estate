import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock3, Search, Tag, TrendingUp, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchArticles, fetchArticleCategories } from "../services/contentService";

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadData() {
      setLoading(true);
      try {
        const [articlesResponse, categoriesResponse] = await Promise.all([
          fetchArticles({ page: 1, limit: 12, search: query, category: selectedCategory }),
          fetchArticleCategories(),
        ]);

        if (!alive) return;

        const articleList = articlesResponse.data?.articles || articlesResponse.articles || [];
        setArticles(articleList);
        setFeaturedArticle(articleList.find((article) => article.featured) || articleList[0] || null);
        setCategories(categoriesResponse.data || categoriesResponse || []);
      } catch (err) {
        if (!alive) return;
        setError(err.message || "تعذر تحميل المدونة في الوقت الحالي.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadData();
    return () => {
      alive = false;
    };
  }, [query, selectedCategory]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesQuery = !query || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [articles, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#183d37]" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[30px] border border-[#d9d0bf] bg-[#183d37] p-6 text-white shadow-[0_22px_60px_rgba(24,61,55,0.18)] sm:p-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-[#e8c56d] uppercase">Aqarx Blog</p>
          <h1 className="text-3xl font-black sm:text-5xl">مدونة Aqarx</h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-[#dfe9e7] sm:text-base">
            نصائح، أخبار، وملفات متخصصة تساعدك على اتخاذ قرارات عقارية أذكى وأفضل.
          </p>
        </div>

        <div className="mb-8 rounded-[26px] border border-[#d9d0bf] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <label className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64817d]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن مقال أو فكرة…"
                className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-12 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
              />
            </label>

            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-3 py-3 text-sm text-[#183d37] outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25">
              <option value="">كل التصنيفات</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[26px] border border-[#ebeadf] bg-white p-4">
                <div className="mb-3 h-40 rounded-2xl bg-[#efe7db]" />
                <div className="mb-2 h-5 w-20 rounded bg-[#efe7db]" />
                <div className="mb-4 h-6 w-2/3 rounded bg-[#efe7db]" />
                <div className="h-4 w-full rounded bg-[#efe7db]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[26px] border border-dashed border-[#d4bd8d] bg-[#fffdf9] p-8 text-center">
            <p className="text-lg font-bold text-[#183d37]">تعذر تحميل المقالات</p>
            <p className="mt-2 text-sm text-[#4a615d]">{error}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-[#d4bd8d] bg-[#fffdf9] p-8 text-center">
            <p className="text-lg font-bold text-[#183d37]">لا توجد مقالات مطابقة لبحثك</p>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <section className="mb-8 overflow-hidden rounded-[32px] border border-[#d9d0bf] bg-white shadow-[0_22px_50px_rgba(17,24,39,0.05)]">
                <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${featuredArticle.coverImage?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80'})` }} />
                  <div className="p-6 sm:p-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff5d9] px-3 py-1.5 text-[11px] font-bold text-[#9a6b18]">
                      <TrendingUp className="h-3.5 w-3.5" />
                      مقال مميز
                    </div>
                    <h2 className="text-2xl font-black text-[#183d37]">{featuredArticle.title}</h2>
                    <p className="mt-3 text-sm leading-8 text-[#4d6965]">{featuredArticle.excerpt}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#4d6965]">
                      <span className="inline-flex items-center gap-2"><UserRound className="h-3.5 w-3.5" />{featuredArticle.author}</span>
                      <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" />{featuredArticle.readingTime || '5 دقائق قراءة'}</span>
                    </div>
                    <Link to={`/blog/${featuredArticle.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#183d37] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#224a45]">
                      اقرأ المقال
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => (
                <article key={article._id} className="overflow-hidden rounded-[28px] border border-[#d9d0bf] bg-white shadow-[0_12px_36px_rgba(17,24,39,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,.08)]">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${article.coverImage?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80'})` }} />
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#edf6f4] px-2.5 py-1 text-[11px] font-bold text-[#183d37]">{article.category}</span>
                      {article.featured && <span className="rounded-full bg-[#fff5d9] px-2.5 py-1 text-[11px] font-bold text-[#9a6b18]">مميز</span>}
                    </div>
                    <h3 className="text-xl font-black text-[#183d37]">{article.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#4d6965]">{article.excerpt}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-[#58706c]">
                      <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{article.author}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{article.readingTime || '5 دقائق'}</span>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#efe9df] pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#58706c]"><Tag className="h-3.5 w-3.5" />{article.tags?.slice(0, 2).join(' • ') || 'أخبار'}</span>
                      <Link to={`/blog/${article.slug}`} className="rounded-full bg-[#183d37] px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#224a45]">اقرأ</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
