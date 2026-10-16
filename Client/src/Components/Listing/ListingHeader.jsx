import { Building2, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function ListingHeader({ isEdit = false }) {
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
  return (
    <div className="relative overflow-hidden mb-3 bg-[#183d37] py-10 text-[#f8f8f3]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(241,182,139,0.18),transparent_35%)]" />
      <div className="absolute -left-10 top-12 text-[18rem] font-black text-[#f8f8f3]/5">
        Aqarx
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-4xl">
          <h1 className="text-3xl font-black text-[#dae3e1] md:text-4xl">
            {isEdit ? "تحديث العقار" : "إضافة عقار جديد"}
          </h1>
        </Reveal>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-[#183d37]/10"></div>

        <div className="flex-1">
          <p className="mt-2 leading-7 text-[#f6f0f0]">
            {isEdit
              ? "عدّل بيانات العقار الحالي مع الحفاظ على صورك الحالية أو رفع صور جديدة بسهولة."
              : "املأ جميع بيانات العقار بدقة، وارفع صورًا واضحة وعالية الجودة لزيادة فرص ظهور إعلانك وجذب المزيد من العملاء."}
          </p>

          <div className="mt-6 flex items-start gap-1 ">
            <Info className="mt-1 text-[#c9a227]" size={20} />

            <div>
              <p className="font-bold text-[#bda621]">
                نصائح للحصول على إعلان احترافي
              </p>

              <ul className="mt-2 list-disc space-y-1 pr-2 text-sm text-[#e8f5ef]">
                <li>استخدم صورًا واضحة بإضاءة جيدة.</li>
                <li>اجعل أول صورة هي أفضل صورة للعقار.</li>
                <li>اكتب وصفًا دقيقًا يشمل أهم المميزات.</li>
                <li>حدد السعر الصحيح لتجنب الاستفسارات غير الجادة.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
