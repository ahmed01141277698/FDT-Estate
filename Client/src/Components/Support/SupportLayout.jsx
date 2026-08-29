import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, CircleHelp, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function SupportLayout({
  title,
  subtitle,
  children,
  breadcrumbLabel = "الدعم",
  breadcrumbHref = "/help-center",
}) {
  return (
    <div
      className="relative min-h-screen bg-[#f5f1ea] text-[#173d36]"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,162,39,0.12),_transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <nav
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#3c5b57]"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="transition hover:text-[#183d37]">
            الرئيسية
          </Link>
          <span className="text-[#8b9c99]">/</span>
          <Link to={breadcrumbHref} className="transition hover:text-[#183d37]">
            {breadcrumbLabel}
          </Link>
        </nav>

        <header className="overflow-hidden rounded-[28px] border border-[#d8cfa9] bg-[#183d37] text-white shadow-[0_25px_70px_rgba(24,61,55,0.18)]">
          <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d7b666]/15 text-[#e8c56d] ring-1 ring-[#d7b666]/40">
                <CircleHelp className="h-7 w-7" />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-[#e8c56d] uppercase">
                  Aqarx Support
                </p>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-3 max-w-2xl text-sm text-[#d5dfdd] sm:text-base">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              العودة إلى الرئيسية
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-[#d9d0bf] bg-white shadow-[0_10px_30px_rgba(17,24,39,.04)]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition hover:bg-[#f7f2ea] sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="text-base font-bold text-[#173d36] sm:text-lg">
                {item.question}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf0eb] text-[#183d37]">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[#efe9df] bg-[#fcfaf7] px-5 py-4 text-sm leading-8 text-[#385a56] sm:px-6">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function LegalPageLayout({
  title,
  subtitle,
  sections,
  lastUpdated = "[تاريخ قابل للتعديل]",
}) {
  return (
    <SupportLayout
      title={title}
      subtitle={subtitle}
      breadcrumbLabel={title}
      breadcrumbHref={title === "الشروط والأحكام" ? "/terms" : "/privacy"}
    >
      <div className="rounded-[28px] border border-[#d9d0bf] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-3 border-b border-[#efe9df] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf3f1] text-[#183d37]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#6b7d7b] uppercase">
                Legal
              </p>
              <h2 className="text-xl font-black text-[#173d36]">
                نسخة واضحة للمستخدم
              </h2>
            </div>
          </div>

          <span className="rounded-full bg-[#f4efe5] px-3 py-1.5 text-xs font-bold text-[#183d37]">
            آخر تحديث: {lastUpdated}
          </span>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="scroll-mt-28">
              <h3 className="mb-4 text-xl font-black text-[#183d37]">
                {section.title}
              </h3>
              <div className="space-y-3 text-[15px] leading-8 text-[#335551]">
                {section.body.map((paragraph, idx) => (
                  <p key={`${section.title}-${idx}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#e7d9ad] bg-[#fff9ef] p-5 text-sm leading-8 text-[#465f5d]">
          <strong className="text-[#183d37]">تنبيه مهم:</strong> هذا النص يهدف
          إلى توضيح الشروط بشكل واضح، لكنه لا يمثل استشارة قانونية أو بديلًا عن
          النسخة القانونية النهائية. قبل النشر الرسمي أو التطبيق التجاري، يُرجى
          مراجعة النسخة القانونية النهائية مع مختص قانوني مناسب.
        </div>
      </div>
    </SupportLayout>
  );
}

export default SupportLayout;
