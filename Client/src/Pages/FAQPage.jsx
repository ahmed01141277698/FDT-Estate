import { Search, MessageCircleQuestion } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FAQAccordion,
  SupportLayout,
} from "../Components/Support/SupportLayout";

const faqs = [
  {
    question: "كيف يمكنني إنشاء حساب؟",
    answer:
      "من الصفحة الرئيسية أو صفحة تسجيل الدخول، اضغط على زر إنشاء حساب، ثم أكمل البيانات المطلوبة مثل الاسم والبريد الإلكتروني وكلمة المرور. بعد ذلك، قد يتم إرسال رمز تحقق إلى بريدك الإلكتروني لإكمال التفعيل.",
  },
  {
    question: "كيف يتم التحقق من البريد الإلكتروني؟",
    answer:
      "بعد إنشاء الحساب ستتلقى رسالة أو رمز تحقق إلى البريد الإلكتروني الذي سجلت به. أدخل الرمز في صفحة التحقق، وبعد التفعيل تصبح بعض الميزات متاحة بشكل كامل.",
  },
  {
    question: "ماذا أفعل إذا لم يصلني رمز التحقق؟",
    answer:
      "تأكد من إدخال البريد الإلكتروني بشكل صحيح، ثم تحقق من مجلد الرسائل غير المرغوبة. إذا لم يصل الرمز، يمكنك طلب إعادة الإرسال من صفحة التحقق أو التواصل مع فريق الدعم.",
  },
  {
    question: "كيف يمكنني إعادة إرسال رمز التحقق؟",
    answer:
      "من صفحة التحقق، اضغط على زر إعادة إرسال الرمز. سيُرسل لك رمز جديد خلال وقت قصير، وإذا لم يصلك مرة أخرى فقم بالتأكد من توفر البريد أو تواصل معنا.",
  },
  {
    question: "كيف أضيف عقارًا جديدًا؟",
    answer:
      "اضغط على زر إضافة عقار من الهيدر، ثم املأ تفاصيل العقار مثل العنوان، النوع، السعر، المساحة، الموقع، والوصف. يمكنك أيضًا رفع الصور الأساسية قبل النشر.",
  },
  {
    question: "هل يمكنني تعديل بيانات العقار بعد نشره؟",
    answer:
      "نعم، غالبًا يمكن تعديل بيانات الإعلان بعد النشر من خلال صفحة العقار أو لوحة الحساب، حسب ما توفره المنصة في ذلك الوقت.",
  },
  {
    question: "كيف أحذف عقاري؟",
    answer:
      "يمكنك حذف أو إلغاء النشر من صفحة تفاصيل العقار أو من إدارة الإعلانات داخل حسابك، وذلك من خلال الخيارات المتاحة في الواجهة.",
  },
  {
    question: "كيف أضيف عقارًا إلى المفضلة؟",
    answer:
      "اضغط على أيقونة القلب الموجودة في بطاقة العقار أو في صفحة تفاصيله. سيتم حفظ العقار تلقائيًا في قائمة المفضلة التي يمكنك الوصول إليها من الهيدر.",
  },
  {
    question: "كيف تعمل الإشعارات؟",
    answer:
      "تُصدر المنصة إشعارات مهمة مثل التحديثات، الرسائل، أو التغييرات ذات الصلة بالحساب والعقارات. يمكنك مراجعة كل الإشعارات من صفحة الإشعارات.",
  },
  {
    question: "نسيت كلمة المرور، ماذا أفعل؟",
    answer:
      "انتقل إلى صفحة تسجيل الدخول واضغط على خيار نسيت كلمة المرور، ثم تابع التعليمات لإعادة تعيينها عبر البريد الإلكتروني المسجل في الحساب.",
  },
  {
    question: "كيف أغير بيانات حسابي؟",
    answer:
      "من صفحة الملف الشخصي يمكنك تحديث معلوماتك مثل الاسم، الصورة، وبيانات الاتصال. احفظ التغييرات بعد المراجعة لضمان تحديث البيانات بشكل صحيح.",
  },
  {
    question: "كيف أحذف حسابي؟",
    answer:
      "يمكنك حذف الحساب من إعدادات الملف الشخصي أو بالمراجعة مع فريق الدعم إذا كانت هذه الميزة تتطلب تأكيدًا إضافيًا أو توجيهًا خاصًا وفقًا لسياسة المنصة.",
  },
  {
    question: "كيف أتواصل مع فريق الدعم؟",
    answer:
      "يمكنك التواصل معنا عبر البريد الإلكتروني المدرج في أسفل الصفحة أو من خلال مركز المساعدة، حيث يمكنك إرسال طلبك أو السؤال الذي تحتاج إليه.",
  },
  {
    question: "كيف تحافظ Aqarx على أمان بيانات المستخدمين؟",
    answer:
      "تطبق Aqarx مجموعة من الإجراءات الأمنية المناسبة لحماية الحسابات والبيانات، وتستخدم أنظمة مناسبة للاتصال، التوثيق، وحماية المعلومات داخل التطبيق والخدمات المرتبطة.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filteredFaqs = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return faqs;

    return faqs.filter((item) => {
      const haystack = `${item.question} ${item.answer}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [search]);

  return (
    <SupportLayout
      title="الأسئلة الشائعة"
      subtitle="إجابات سريعة ومباشرة حول الحساب، العقارات، الأمان، والدعم في Aqarx."
      breadcrumbLabel="الأسئلة الشائعة"
      breadcrumbHref="/faq"
    >
      <div className="rounded-[28px] border border-[#d9d0bf] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64817d]" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث في الأسئلة الشائعة…"
            className="w-full rounded-2xl border border-[#dfe7e4] bg-[#f8faf9] px-12 py-3.5 text-sm text-[#183d37] shadow-inner outline-none transition focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/25"
          />
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-[#c4b58a] bg-[#fffdf9] p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4d5] text-[#c68d1d]">
            <MessageCircleQuestion className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black text-[#183d37]">
            لا توجد أسئلة مطابقه لبحثك
          </h3>
          <p className="mt-2 text-sm text-[#4a615d]">
            جرّب كلمة مختلفة أو تواصل معنا مباشرة للحصول على إجابة دقيقة.
          </p>
          <Link
            to="/help-center"
            className="mt-6 inline-flex items-center rounded-full bg-[#183d37] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#224a45]"
          >
            العودة إلى مركز المساعدة
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <FAQAccordion items={filteredFaqs} />
        </div>
      )}
    </SupportLayout>
  );
}
