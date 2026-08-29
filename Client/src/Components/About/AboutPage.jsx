import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpLeft,
  Brain,
  Building2,
  Check,
  Compass,
  Layers3,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import aqarxLogo from "../../assets/aqarx-header-logo.png";

const beliefs = [
  {
    icon: Compass,
    title: "الوضوح",
    text: "المعلومات العقارية يجب أن تكون واضحة وسهلة الفهم، حتى يستطيع المستخدم اتخاذ قرار أفضل.",
  },
  {
    icon: ShieldCheck,
    title: "الثقة",
    text: "نؤمن أن الثقة تبدأ من جودة المعلومات وشفافية التجربة.",
  },
  {
    icon: Brain,
    title: "الذكاء",
    text: "نستخدم التكنولوجيا لبناء تجربة تساعد المستخدم على الوصول إلى ما يبحث عنه بشكل أسرع.",
  },
  {
    icon: Layers3,
    title: "البساطة",
    text: "التكنولوجيا يجب أن تجعل التجربة أبسط، لا أكثر تعقيداً.",
  },
];

const missionSteps = [
  {
    title: "Discover",
    text: "اكتشف العقارات والفرص المناسبة.",
    accent: "#f1b68b",
  },
  {
    title: "Connect",
    text: "تواصل مع الأطراف المناسبة بسهولة.",
    accent: "#c9a227",
  },
  {
    title: "Decide",
    text: "اتخذ قرارك بناءً على معلومات واضحة.",
    accent: "#e49263",
  },
];

const trustItems = [
  {
    title: "Account Security",
    text: "حماية الحسابات وتوفير تجربة تسجيل دخول موثوقة.",
  },
  {
    title: "Data Protection",
    text: "حماية البيانات الشخصية والعقارية بعقلية تصميمية أولية.",
  },
  {
    title: "Reliable Experience",
    text: "تجربة مستمرة، متسقة، وموثوقة في كل خطوة.",
  },
];

const techTags = [
  "Smart Search",
  "Secure Access",
  "Real-Time Notifications",
  "Verified Listings",
  "Performance",
  "Security",
  "User Experience",
  "Scalability",
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  useEffect(() => {
    document.title = "من نحن | Aqarx";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content =
      "Aqarx منصة عقارية ذكية تركز على الوضوح والثقة والسهولة في اكتشاف العقارات واتخاذ القرارات العقارية.";
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f8f3] text-[#183d37]" dir="rtl">
      <section className="relative overflow-hidden bg-[#0f2622] text-[#f8f8f3]">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[-8rem] top-[-3rem] h-80 w-80 rounded-full bg-[#e49263]/20 blur-3xl" />
          <div className="absolute bottom-[-4rem] right-[-2rem] h-72 w-72 rounded-full bg-[#c9a227]/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 lg:block" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center gap-3 text-sm text-[#d7ecdf]">
                <img
                  src={aqarxLogo}
                  alt="Aqarx - منصة عقارية ذكية"
                  className="h-11 w-auto opacity-90"
                />
                <span className="tracking-[0.18em] text-[#f0c98a]">
                  ABOUT AQARX
                </span>
              </div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f1b68b]/30 bg-[#f1b68b]/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.22em] text-[#f1b68b]">
                PRODUCT-LED REAL ESTATE PLATFORM
              </div>

              <h1
                className="text-4xl
                 font-black leading-[1.7] tracking-[-0.03em] text-[#f8f8f3] sm:text-5xl lg:text-6xl lg:leading-[1.6]"
              >
                نحن نبني تجربة عقارية أكثر ذكاءً.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-[2] text-[#edf3ee] sm:text-lg">
                في Aqarx نعيد التفكير في الطريقة التي يبحث بها الناس عن
                العقارات، يكتشفون الفرص، ويتخذون قراراتهم بثقة من خلال منصة
                مبنية على الوضوح والتكنولوجيا والاعتماد على تجربة مستخدم سهلة،
                سريعة، وموثوقة.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/AllListings"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e49263] px-6 py-3.5 text-sm font-extrabold text-[#183d37] transition hover:bg-[#f1b68b]"
                >
                  استكشف العقارات
                  <ArrowLeft size={17} />
                </Link>

                <Link
                  to="/create-listing"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-extrabold text-[#f8f8f3] transition hover:bg-white/10"
                >
                  أضف عقارك
                  <Building2 size={17} />
                </Link>
              </div>

              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 sm:gap-4">
                {[
                  ["Search UX", "Smarter"],
                  ["Trust Layer", "Built-in"],
                  ["Fast Discovery", "Product-led"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                  >
                    <div className="text-[10px] tracking-[0.15em] text-[#d7ecdf]/75">
                      {label}
                    </div>
                    <div className="mt-2 text-lg font-black text-[#f8f8f3]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="relative rounded-[28px] border border-white/10 bg-[#183d37]/60 p-4 shadow-[0_30px_80px_rgba(10,25,24,0.45)] backdrop-blur-sm"
              >
                <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(201,162,39,0.18),transparent_40%)]" />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-xs text-[#d7ecdf]/80">
                        قائمة العقارات
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-[#f8f8f3]">
                        بحث ذكي
                      </h2>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e49263]/15 text-[#f1b68b]">
                      <Compass size={18} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-[#f1b68b]/25 bg-[#f8f8f3] p-4 text-[#183d37] shadow-lg">
                      <div className="flex items-center justify-between text-xs text-[#6b7d76]">
                        <span>فيلا فاخرة</span>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 font-bold text-emerald-700">
                          <Check size={12} /> موثّق
                        </span>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[linear-gradient(135deg,#dfeae4,#f7f7f0)] p-3">
                        <div className="mb-3 h-28 rounded-xl bg-[linear-gradient(135deg,#183d37,#2c564a_30%,#d8aa79)]" />
                        <div className="space-y-2">
                          <div className="h-2.5 w-2/3 rounded-full bg-[#183d37]/20" />
                          <div className="h-2.5 w-1/2 rounded-full bg-[#183d37]/15" />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-[#6b7d76]">
                        <span>٦ أكتوبر</span>
                        <span className="text-lg font-black text-[#183d37]">
                          2.8M
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-[#f8f8f3]/5 p-4 text-[#f8f8f3]">
                        <p className="text-xs text-[#d7ecdf]/80">المفضلة</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-2xl font-black">24</span>
                          <div className="rounded-full bg-[#e49263]/15 p-2 text-[#f1b68b]">
                            <Star size={16} fill="currentColor" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/10 p-4">
                        <p className="text-xs text-[#f8f8f3]/70">مؤشر الثقة</p>
                        <div className="mt-4 h-2.5 rounded-full bg-white/10">
                          <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,#e49263,#c9a227,#f1b68b)]" />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-[#f8f8f3]">
                          <span>أمان</span>
                          <span className="font-bold">82%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      ["بحث", "Smart Search"],
                      ["معلومات", "Verified"],
                      ["قرار", "Confident"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-3"
                      >
                        <div className="text-lg font-black text-[#f8f8f3]">
                          {label}
                        </div>
                        <div className="mt-1 text-[10px] text-[#d7ecdf]/80">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="flex items-center gap-6 lg:justify-center">
            <div className="text-[5rem] font-black leading-none text-[#183d37]/15">
              01
            </div>
            <div className="h-32 w-px bg-[#183d37]/20 lg:h-44" />
          </div>

          <div>
            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-[#6b7d76]">
              OUR STORY
            </p>
            <h2 className="text-3xl font-black leading-[1.2] tracking-[-0.03em] text-[#183d37] sm:text-4xl lg:text-5xl">
              كيف بدأت Aqarx؟
            </h2>

            <div className="mt-8 rounded-[28px] border border-[#183d37]/10 bg-[#f8f8f3] p-6 shadow-[0_12px_30px_rgba(24,61,55,0.04)] sm:p-8">
              <p className="text-lg leading-[2] text-[#1d2f2d]">
                Aqarx بدأت من فكرة بسيطة: لماذا لا تكون تجربة البحث عن العقار
                أكثر وضوحاً، وأكثر ذكاءً، وأقل تعقيداً؟
              </p>

              <div className="mt-6 border-t border-[#183d37]/10 pt-6">
                <p className="text-base leading-[2] text-[#495f59]">
                  العقار قرار كبير، ولذلك يجب أن تكون المعلومات التي يعتمد عليها
                  المستخدم واضحة، والتجربة التي يمر بها بسيطة، والفرص التي
                  يكتشفها أقرب إلى احتياجاته الحقيقية.
                  <span className="mt-4 block text-[#183d37] font-semibold">
                    من هنا جاءت Aqarx.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#f1efe8] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-[#6b7d76]">
              PRODUCT PRINCIPLES
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] text-[#183d37] sm:text-4xl lg:text-5xl">
              ما الذي نؤمن به؟
            </h2>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {beliefs.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className="group rounded-[24px] border border-[#183d37]/10 bg-[#f8f8f3] p-6 shadow-[0_10px_25px_rgba(24,61,55,0.04)] transition-shadow hover:shadow-[0_18px_35px_rgba(24,61,55,0.08)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#183d37] text-[#f1b68b] shadow-sm">
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl font-black text-[#183d37]">{title}</h3>
                <p className="mt-4 text-base leading-8 text-[#6b7d76]">
                  {text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="order-2 lg:order-1">
            <div className="rounded-[30px] border border-[#183d37]/10 bg-[#f8f8f3] p-4 shadow-[0_18px_45px_rgba(24,61,55,0.06)] sm:p-6">
              <div className="rounded-[24px] bg-[#0f2622] p-4 text-[#f8f8f3]">
                <div className="mb-4 flex items-center justify-between text-sm text-[#d7ecdf]/80">
                  <span>بحث العقارات</span>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-xs">
                    Live
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#d7ecdf]/80">
                      <span>الموقع</span>
                      <span>الجيزة</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-[#f1b68b]" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#d7ecdf]/80">
                      <span>السعر</span>
                      <span>2.4M</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-[#c9a227]" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#f8f8f3] p-3 text-[#183d37]">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-[#6b7d76]">شقة عصرية</p>
                      <h3 className="mt-1 text-lg font-black">
                        Mira Residence
                      </h3>
                    </div>
                    <div className="rounded-full bg-[#e49263]/15 p-2 text-[#e49263]">
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>

                  <div className="mt-4 h-24 rounded-2xl bg-[linear-gradient(135deg,#d9d9cf,#7d9b96_35%,#183d37)]" />

                  <div className="mt-4 flex items-center justify-between text-xs text-[#6b7d76]">
                    <span>٣ غرف</span>
                    <span>المنطقة: 160 م²</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <p className="text-sm font-bold tracking-[0.2em] text-[#6b7d76]">
              WHY AQARX
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] text-[#183d37] sm:text-4xl lg:text-5xl">
              منصة مصممة للبحث، الفهم، والقرار.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-[2] text-[#4f615d] sm:text-lg">
              Aqarx ليست مجرد مساحة لعرض العقارات. نحن نبني تجربة منتج رقمية
              تجعل رحلة المستخدم أكثر سهولة، أكثر وضوحاً، وأسرع في الوصول إلى ما
              يبحث عنه، من أول نقطة بحث إلى اتخاذ القرار بثقة.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Search experience designed around user intent",
                "Clear property context before the decision",
                "Notification-driven follow-up and engagement",
                "A simple product experience built for clarity",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#183d37]/10 bg-[#f8f8f3] p-4 transition hover:border-[#183d37]/20 hover:shadow-[0_8px_24px_rgba(24,61,55,0.06)]"
                >
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#e49263]/15 text-[#e49263]">
                    <Check size={16} />
                  </div>
                  <p className="text-base leading-[2] text-[#1f2f2d]">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#183d37] py-20 text-[#f8f8f3]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(241,182,139,0.18),transparent_35%)]" />
        <div className="absolute -left-10 top-12 text-[18rem] font-black text-[#f8f8f3]/5">
          Aqarx
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-4xl">
            <p className="text-sm font-bold tracking-[0.2em] text-[#d7ecdf]/80">
              OUR VISION
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-6xl">
              رؤيتنا
            </h2>
            <p className="mt-8 text-lg leading-[2] text-[#edf3ee] sm:text-2xl">
              أن نصبح المنصة العقارية الموثوقة التي تجمع بين المنتج الجيد،
              البيانات الواضحة، وتجربة المستخدم الذكية، بحيث يصبح اكتشاف الفرص
              العقارية أسهل، وأخذ القرار أكثر وعياً.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-[#6b7d76]">
            OUR MISSION
          </p>
          <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] text-[#183d37] sm:text-4xl lg:text-5xl">
            مهمتنا
          </h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-1/2 top-10 hidden h-px w-[70%] -translate-x-1/2 bg-[#183d37]/10 lg:block" />

          <div className="grid gap-6 lg:grid-cols-3">
            {missionSteps.map(({ title, text, accent }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-[28px] border border-[#183d37]/10 bg-[#f8f8f3] p-6 text-center shadow-[0_12px_30px_rgba(24,61,55,0.04)]"
              >
                <div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-lg font-black"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  0{index + 1}
                </div>
                <h3 className="text-2xl font-black text-[#183d37]">{title}</h3>
                <p className="mt-4 text-base leading-8 text-[#6b7d76]">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1efe8] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.2em] text-[#6b7d76]">
              TECHNOLOGY
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] text-[#183d37] sm:text-4xl lg:text-5xl">
              المنتج العقاري الذي يعمل كمنصة ذكية
            </h2>
            <p className="mt-6 text-base leading-[2] text-[#4e635f] sm:text-lg">
              نحن نستخدم التكنولوجيا لبناء تجربة عقارية أسرع وأكثر مرونة، مع
              التركيز على الأداء، الأمان، تجربة المستخدم، وقابلية التوسع في منصة
              تساعد المستخدم على الوصول إلى ما يحتاجه بسرعة ووضوح.
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-3">
            {techTags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ y: -2 }}
                className="rounded-full border border-[#183d37]/10 bg-[#f8f8f3] px-4 py-2 text-sm font-semibold text-[#183d37] shadow-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-3xl">
          <p className="text-sm font-bold tracking-[0.2em] text-[#6b7d76]">
            TRUST
          </p>
          <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] text-[#183d37] sm:text-4xl lg:text-5xl">
            الثقة جزء من التجربة.
          </h2>
        </Reveal>

        <p className="max-w-4xl text-base leading-[2] text-[#4e635f] sm:text-lg">
          نحن نتعامل مع البيانات العقارية وحسابات المستخدمين باعتبارها جزءاً
          أساسياً من تجربة المنصة، لذلك نضع الأمان والخصوصية والموثوقية ضمن
          أولويات التصميم والتطوير.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {trustItems.map(({ title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-[26px] border border-[#183d37]/10 bg-[#f8f8f3] p-6 shadow-[0_12px_30px_rgba(24,61,55,0.04)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#183d37] text-[#f1b68b]">
                {index === 0 ? (
                  <ShieldCheck size={22} />
                ) : index === 1 ? (
                  <Target size={22} />
                ) : (
                  <TrendingUp size={22} />
                )}
              </div>
              <h3 className="text-2xl font-black leading-[1.3] text-[#183d37]">
                {title}
              </h3>
              <p className="mt-4 text-base leading-[2] text-[#4f615d]">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0f2622] py-20 text-[#f8f8f3]">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
          <div className="absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 rounded-full border border-[#f1b68b]/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-4xl">
            <p className="text-sm font-bold tracking-[0.2em] text-[#dfeae4]/80">
              FUTURE
            </p>
            <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              والقادم أكبر.
            </h2>
            <p className="mt-8 text-lg leading-[2] text-[#edf3ee] sm:text-2xl">
              Aqarx ليست نهاية الفكرة، بل بدايتها.
              <span className="mt-3 block">
                نحن نعمل على تطوير تجربة عقارية تتطور مع احتياجات المستخدمين
                والسوق، وتفتح المجال أمام أدوات وخدمات أكثر ذكاءً في المستقبل.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="rounded-[32px] border border-[#183d37]/10 bg-[linear-gradient(135deg,#183d37_0%,#0f2622_100%)] p-8 text-[#f8f8f3] shadow-[0_22px_60px_rgba(15,38,34,0.15)] sm:p-12 lg:p-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.2em] text-[#d7ecdf]/80">
                READY TO EXPLORE
              </p>
              <h2 className="mt-4 text-3xl font-black leading-[1.2] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                جاهز لاكتشاف فرصتك العقارية القادمة؟
              </h2>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/AllListings"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e49263] px-6 py-3.5 text-sm font-extrabold text-[#183d37] transition hover:bg-[#f1b68b]"
              >
                استكشف العقارات
                <ArrowUpLeft size={17} />
              </Link>

              <Link
                to="/create-listing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-extrabold text-[#f8f8f3] transition hover:bg-white/10"
              >
                أضف عقارك
                <Sparkles size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
