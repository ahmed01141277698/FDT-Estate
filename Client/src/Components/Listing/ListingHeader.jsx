import { Building2, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function ListingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>

        {/* Title */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            إضافة عقار جديد
          </h1>

          <p className="text-gray-500 mt-2 leading-7">
            املأ جميع بيانات العقار بدقة، وارفع صورًا واضحة وعالية الجودة لزيادة
            فرص ظهور إعلانك وجذب المزيد من العملاء.
          </p>

          {/* Tips */}
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 p-4">
            <Info className="text-blue-600 mt-1" size={20} />

            <div>
              <p className="font-semibold text-blue-800">
                نصائح للحصول على إعلان احترافي
              </p>

              <ul className="mt-2 text-sm text-blue-700 space-y-1 list-disc pr-5">
                <li>استخدم صورًا واضحة بإضاءة جيدة.</li>
                <li>اجعل أول صورة هي أفضل صورة للعقار.</li>
                <li>اكتب وصفًا دقيقًا يشمل أهم المميزات.</li>
                <li>حدد السعر الصحيح لتجنب الاستفسارات غير الجادة.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
