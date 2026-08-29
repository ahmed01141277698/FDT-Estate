import {
  Search,
  ShieldCheck,
  UserRoundCog,
  MailCheck,
  Building2,
  PlusCircle,
  Star,
  Bell,
  UserCircle2,
  LockKeyhole,
  Wrench,
  ArrowLeft,
  MessageCircleMore,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SupportLayout } from "../Components/Support/SupportLayout";

const helpCategories = [
  {
    title: "الحساب وتسجيل الدخول",
    icon: UserRoundCog,
    summary: "إنشاء الحساب، تسجيل الدخول، واستعادة الوصول إلى حسابك.",
    articles: [
      {
        title: "كيف يمكنني إنشاء حساب؟",
        text: "اضغط على زر إنشاء حساب من الصفحة الرئيسية أو نموذج التسجيل، ثم أكمل بياناتك وتأكد من بريدك الإلكتروني للتفعيل.",
      },
      {
        title: "ما الذي يحدث إذا نسيت كلمة المرور؟",
        text: "يمكنك استخدام خيار إعادة تعيين كلمة المرور من صفحة تسجيل الدخول، ثم اتباع الرابط المرسل إلى بريدك.",
      },
      {
        title: "كيف أستطيع تغيير بيانات الحساب؟",
        text: "من صفحة الملف الشخصي يمكنك تحديث الاسم، الصورة، المعلومات الشخصية أو بيانات الاتصال.",
      },
    ],
  },
  {
    title: "التحقق من البريد الإلكتروني",
    icon: MailCheck,
    summary: "إجراءات تفعيل البريد الإلكتروني وتأكيد الحساب.",
    articles: [
      {
        title: "كيف يتم التحقق من بريدي الإلكتروني؟",
        text: "بعد إنشاء الحساب، ستتلقى رمز تحقق يرسل إلى بريدك، ويجب إدخاله في صفحة التحقق قبل استخدام بعض الميزات.",
      },
      {
        title: "ماذا لو لم أصلني الرمز؟",
        text: "يفضل التحقق من مجلد الرسائل غير المرغوبة أو إعادة إرسال الرمز من صفحة التحقق.",
      },
      {
        title: "هل يمكنني إعادة إرسال الرمز؟",
        text: "نعم، يوجد خيار إعادة إرسال رمز التحقق داخل صفحة تأكيد البريد الإلكتروني.",
      },
    ],
  },
  {
    title: "العقارات والإعلانات",
    icon: Building2,
    summary: "الاستعراض، البحث، وعرض تفاصيل العقارات.",
    articles: [
      {
        title: "كيف أبحث عن عقار معين؟",
        text: "استخدم شريط البحث والفلترة حسب المدينة، نوع العقار، السعر، والغرض من العقار في صفحة العقارات.",
      },
      {
        title: "هل أستطيع مقارنة العقارات؟",
        text: "يمكنك الاطلاع على تفاصيل العقارات المختلفة ومقارنتها من خلال صفحات النتائج والتفاصيل.",
      },
      {
        title: "كيف أراجع تفاصيل الإعلان؟",
        text: "اضغط على العقار من نتائج البحث لعرض التفاصيل، الصور، الموقع، ووصف الإعلان بالكامل.",
      },
    ],
  },
  {
    title: "إضافة عقار",
    icon: PlusCircle,
    summary: "نشر عقار جديد، بياناته، والصور.",
    articles: [
      {
        title: "كيف أضيف عقارًا جديدًا؟",
        text: "من خلال زر إضافة عقار في رأس الصفحة، ثم قم بملء تفاصيل العقار مع الصور والموقع والسعر.",
      },
      {
        title: "ما البيانات المطلوبة؟",
        text: "عادةً تحتاج إلى عنوان العقار، نوعه، السعر، المساحة، الغرض، وصف تفصيلي، والموقع أو الصور الرئيسية.",
      },
      {
        title: "هل يمكنني تعديل إعلان بعد النشر؟",
        text: "نعم، يمكن تحديث المعلومات في بعض الحالات من خلال صفحة تفاصيل العقار أو لوحة الحساب الشخصي.",
      },
    ],
  },
  {
    title: "المفضلة",
    icon: Star,
    summary: "حفظ العقارات المفضلة ومتابعتها.",
    articles: [
      {
        title: "كيف أضيف عقارًا إلى المفضلة؟",
        text: "اضغط على أيقونة القلب داخل بطاقة العقار أو صفحة تفاصيله، ثم ستظهر في قائمة المفضلة.",
      },
      {
        title: "أين يمكنني مراجعة المفضلة؟",
        text: "يمكنك الدخول إلى صفحة المفضلة من القائمة الرئيسية أو من أيقونة القلب في الهيدر.",
      },
      {
        title: "هل يمكنني إزالة عقار من المفضلة؟",
        text: "نعم، اضغط على نفس أيقونة القلب مرة أخرى أو استخدم خيار الإزالة من صفحة المفضلة.",
      },
    ],
  },
  {
    title: "الإشعارات",
    icon: Bell,
    summary: "إدارة التنبيهات والرسائل المهمة.",
    articles: [
      {
        title: "كيف تعمل الإشعارات؟",
        text: "تتلقى تنبيهات حول تحديثات العقارات، الرسائل المهمة، وتغييرات الحساب عند توفرها.",
      },
      {
        title: "كيف أراجع الإشعارات القديمة؟",
        text: "يمكنك الدخول إلى صفحة الإشعارات لمعرفة كافة الرسائل والتحديثات الأخيرة.",
      },
      {
        title: "هل يمكنني إخفاء بعض التنبيهات؟",
        text: "تتيح المنصة إدارة التنبيهات بشكل مناسب داخل صفحة الإشعارات حسب توفر الخيارات.",
      },
    ],
  },
  {
    title: "الملف الشخصي",
    icon: UserCircle2,
    summary: "إدارة الحساب، الصورة، والبيانات الشخصية.",
    articles: [
      {
        title: "كيف أعدل بيانات حسابي؟",
        text: "من صفحة الملف الشخصي قم بفتح قسم التعديل ثم احفظ التغييرات بعد مراجعة البيانات.",
      },
      {
        title: "هل يمكنني تغيير الصورة الشخصية؟",
        text: "نعم، عادةً يمكن رفع صورة جديدة عبر ملفك الشخصي إذا كانت الخدمة متاحة في حسابك.",
      },
      {
        title: "كيف أستعرض الملف الشخصي العام؟",
        text: "يمكنك زيارة رابط الملف الشخصي الخاص بك أو ملف المستخدم الذي تريد الاطلاع عليه من خلال الحساب.",
      },
    ],
  },
  {
    title: "الأمان والخصوصية",
    icon: LockKeyhole,
    summary: "حماية البيانات والتأكد من استخدام موثوق.",
    articles: [
      {
        title: "كيف تحافظ Aqarx على أمان بيانات المستخدمين؟",
        text: "تطبق المنصة ممارسات أمنية مناسبة للبيانات، وتستخدم تدابير الحماية داخل التطبيق والاتصال مع الخدمات المساندة.",
      },
      {
        title: "هل أحتاج إلى مشاركة معلومات شخصية إضافية؟",
        text: "يتم جمع فقط المعلومات الضرورية للعمل داخل المنصة، وفقًا لسياسة الخصوصية المطبقة.",
      },
      {
        title: "ما الذي أفعله إذا كانت بياناتي غير دقيقة؟",
        text: "يمكنك تحديث بياناتك من الملف الشخصي أو التواصل مع الدعم في حال وجود مشكلة في الحساب أو الإعلان.",
      },
    ],
  },
  {
    title: "المشاكل التقنية",
    icon: Wrench,
    summary: "حل المشكلات الشائعة في التطبيق والسحب/التحميل.",
    articles: [
      {
        title: "لماذا لا يتم تحميل الصفحة؟",
        text: "تأكد من اتصال الإنترنت، تحديث المتصفح، ثم أعد تحميل الصفحة. إذا استمرت المشكلة، راجع فريق الدعم.",
      },
      {
        title: "هل توجد مشكلة في الصور أو الروابط؟",
        text: "أحيانًا تحدث أخطاء في الصور أو الارتباطات بسبب الشبكة أو إعدادات الخادم؛ يمكنك إعادة المحاولة ثم التواصل مع الدعم.",
      },
      {
        title: "كيف أبلغ عن خطأ؟",
        text: "يمكنك التواصل مباشرة مع فريق الدعم من خلال البريد الإلكتروني المتاح في أسفل الصفحة أو من صفحة الدعم.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return helpCategories;

    return helpCategories
      .map((category) => ({
        ...category,
        articles: category.articles.filter((article) => {
          const haystack =
            `${category.title} ${article.title} ${article.text}`.toLowerCase();
          return haystack.includes(normalized);
        }),
      }))
      .filter(
        (category) =>
          category.articles.length > 0 ||
          category.title.toLowerCase().includes(normalized),
      );
  }, [search]);

  return (
    <SupportLayout
      title="كيف يمكننا مساعدتك؟"
      subtitle="ابحث عن حلولك بسرعة أو تصفح الأقسام الأكثر شيوعًا في أqarx."
      breadcrumbLabel="مركز المساعدة"
      breadcrumbHref="/help-center"
    >
      <div className="rounded-[28px] border border-[#d9d0bf] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64817d]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن موضوع أو كلمة رئيسية…"
            className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-12 py-3.5 text-sm text-[#183d37] shadow-inner outline-none transition focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-[#c4b58a] bg-[#fffdf9] p-8 text-center shadow-[0_10px_30px_rgba(17,24,39,0.03)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4d5] text-[#c68d1d]">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-[#183d37]">
            لا توجد نتائج مطابقة لبحثك
          </h3>
          <p className="mt-2 text-sm text-[#4a615d]">
            جرّب كلمة مختلفة أو تواصل مع فريق الدعم إذا كنت بحاجة إلى مساعدة
            مباشرة.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-full bg-[#183d37] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#224a45]"
            >
              إعادة تعيين البحث
            </button>
            <a
              href="mailto:ahmedalfaod230@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9d0bf] bg-white px-4 py-2.5 text-sm font-bold text-[#183d37] transition hover:bg-[#f7f2ea]"
            >
              <MessageCircleMore className="h-4 w-4" />
              تواصل مع الدعم
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => {
            const Icon = category.icon;

            return (
              <section
                key={category.title}
                className="rounded-[26px] border border-[#d9d0bf] bg-white p-5 shadow-[0_12px_36px_rgba(17,24,39,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(17,24,39,.08)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f4] text-[#183d37]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#f9f3e6] px-2.5 py-1 text-[11px] font-bold text-[#8a6a16]">
                    {category.articles.length} مقال
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-black text-[#183d37]">
                  {category.title}
                </h3>
                <p className="mb-5 text-sm leading-7 text-[#4d6965]">
                  {category.summary}
                </p>

                <div className="space-y-2.5">
                  {category.articles.map((article) => (
                    <article
                      key={article.title}
                      className="rounded-2xl border border-[#f0ece4] bg-[#faf9f6] p-3 transition hover:border-[#d7b666]/60 hover:bg-[#fffdf9]"
                    >
                      <h4 className="text-sm font-bold text-[#183d37]">
                        {article.title}
                      </h4>
                      <p className="mt-1 text-xs leading-6 text-[#58706c]">
                        {article.text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-[28px] border border-[#d9d0bf] bg-[#183d37] p-6 text-white shadow-[0_18px_46px_rgba(24,61,55,0.18)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#e8c56d]">
              لم تجد ما تبحث عنه؟
            </p>
            <h3 className="mt-1 text-2xl font-black">
              تواصل مع فريق الدعم مباشرة
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:ahmedalfaod230@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#e8c56d] px-4 py-2.5 text-sm font-extrabold text-[#183d37] transition hover:bg-[#f2d376]"
            >
              <MessageCircleMore className="h-4 w-4" />
              ahmedalfaod230@gmail.com
            </a>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              عرض الأسئلة الشائعة
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
