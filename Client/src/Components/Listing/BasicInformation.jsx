// import { FileText, MapPin, AlignLeft } from "lucide-react";
// import { motion } from "framer-motion";

// export default function BasicInfoSection({ form, handleChange, errors = {} }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 25 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//       className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
//     >
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         المعلومات الأساسية
//       </h2>

//       <div className="space-y-6">
//         {/* Property Name */}

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             اسم العقار
//           </label>

//           <div className="relative">
//             <FileText
//               size={18}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="مثال : شقة للبيع بمدينة نصر"
//               className={`w-full rounded-xl border py-3 pr-11 pl-4 outline-none transition

//               ${
//                 errors.name
//                   ? "border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
//             />
//           </div>

//           {errors.name && (
//             <p className="text-red-500 text-sm mt-2">{errors.name}</p>
//           )}
//         </div>

//         {/* Address */}

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             عنوان العقار
//           </label>

//           <div className="relative">
//             <MapPin
//               size={18}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               type="text"
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               placeholder="مثال : الشيخ زايد - الحي الأول"
//               className={`w-full rounded-xl border py-3 pr-11 pl-4 outline-none transition

//               ${
//                 errors.address
//                   ? "border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
//             />
//           </div>

//           {errors.address && (
//             <p className="text-red-500 text-sm mt-2">{errors.address}</p>
//           )}
//         </div>

//         {/* Description */}

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             وصف العقار
//           </label>

//           <div className="relative">
//             <AlignLeft
//               size={18}
//               className="absolute right-4 top-5 text-gray-400"
//             />

//             <textarea
//               rows={6}
//               maxLength={1000}
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               placeholder="اكتب وصفًا احترافيًا يوضح أهم مميزات العقار..."
//               className={`w-full rounded-xl border pt-4 pr-11 pl-4 pb-4 outline-none resize-none transition

//               ${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
//             />
//           </div>

//           <div className="flex justify-between mt-2">
//             {errors.description ? (
//               <span className="text-red-500 text-sm">{errors.description}</span>
//             ) : (
//               <span></span>
//             )}

//             <span
//               className={`text-sm

//               ${
//                 form.description.length > 900
//                   ? "text-orange-500"
//                   : "text-gray-400"
//               }`}
//             >
//               {form.description.length}/1000
//             </span>
//           </div>
//         </div>
//         {/* Category */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             نوع العقار
//           </label>

//           <select
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             className={`w-full rounded-xl border py-3 px-4 outline-none transition bg-white

//     ${
//       errors.category
//         ? "border-red-500"
//         : "border-gray-300 focus:border-blue-500"
//     }`}
//           >
//             <option value="">اختر نوع العقار</option>
//             <option value="فيلا">فيلا</option>
//             <option value="شقة">شقة</option>
//             <option value="تاون هاوس">تاون هاوس</option>
//             <option value="دوبلكس">دوبلكس</option>
//             <option value="بنتهاوس">بنتهاوس</option>
//             <option value="مكتب">مكتب</option>
//             <option value="محل تجاري">محل تجاري</option>
//             <option value="أرض">أرض</option>
//           </select>

//           {errors.category && (
//             <p className="text-red-500 text-sm mt-2">{errors.category}</p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

import { FileText, MapPin, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BasicInfoSection({ form, handleChange, errors = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border p-6 shadow-sm"
      style={{ background: "#fff", borderColor: "rgba(24,61,55,0.1)" }}
    >
      <h2 className="mb-6 text-2xl font-black text-[#183d37]">
        المعلومات الأساسية
      </h2>

      <div className="space-y-6">
        {/* Property Name */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            اسم العقار
          </label>

          <div className="relative">
            <FileText
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
            />

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="مثال : شقة للبيع بمدينة نصر"
              className={`w-full rounded-xl border py-3 pl-4 pr-11 outline-none transition ${
                errors.name
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />
          </div>

          {errors.name && (
            <p className="mt-2 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            عنوان العقار
          </label>

          <div className="relative">
            <MapPin
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a988f]"
            />

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="مثال : الشيخ زايد - الحي الأول"
              className={`w-full rounded-xl border py-3 pl-4 pr-11 outline-none transition ${
                errors.address
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />
          </div>

          {errors.address && (
            <p className="mt-2 text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            وصف العقار
          </label>

          <div className="relative">
            <AlignLeft
              size={18}
              className="absolute right-4 top-5 text-[#8a988f]"
            />

            <textarea
              rows={6}
              maxLength={1000}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="اكتب وصفًا احترافيًا يوضح أهم مميزات العقار..."
              className={`w-full resize-none rounded-xl border pb-4 pl-4 pr-11 pt-4 outline-none transition ${
                errors.description
                  ? "border-red-500"
                  : "border-[#183d37]/15 focus:border-[#c9a227]"
              }`}
            />
          </div>

          <div className="mt-2 flex justify-between">
            {errors.description ? (
              <span className="text-sm text-red-500">{errors.description}</span>
            ) : (
              <span></span>
            )}

            <span
              className={`text-sm ${form.description.length > 900 ? "text-orange-500" : "text-[#8a988f]"}`}
            >
              {form.description.length}/1000
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-bold text-[#183d37]">
            نوع العقار
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition ${
              errors.category
                ? "border-red-500"
                : "border-[#183d37]/15 focus:border-[#c9a227]"
            }`}
          >
            <option value="">اختر نوع العقار</option>
            <option value="فيلا">فيلا</option>
            <option value="شقة">شقة</option>
            <option value="تاون هاوس">تاون هاوس</option>
            <option value="دوبلكس">دوبلكس</option>
            <option value="بنتهاوس">بنتهاوس</option>
            <option value="مكتب">مكتب</option>
            <option value="محل تجاري">محل تجاري</option>
            <option value="أرض">أرض</option>
          </select>

          {errors.category && (
            <p className="mt-2 text-sm text-red-500">{errors.category}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
