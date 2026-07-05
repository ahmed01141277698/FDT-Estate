// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const initialForm = {
//   name: "",
//   description: "",
//   address: "",
//   price: "",
//   discountPrice: "",
//   bedrooms: "",
//   bathrooms: "",
//   area: "",
//   furnished: false,
//   parking: false,
//   type: "rent",
//   offer: false,
//   imageUrl: [],
// };

// export default function CreateListing() {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();

//   const [form, setForm] = useState(initialForm);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadError, setUploadError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + imagePreviews.length > 6) {
//       setUploadError("الحد الاقصى 6 صور فقط");
//       return;
//     }
//     setUploadError(null);
//     setImageFiles((prev) => [...prev, ...files]);
//     const previews = files.map((f) => URL.createObjectURL(f));
//     setImagePreviews((prev) => [...prev, ...previews]);
//   };

//   const removeImage = (idx) => {
//     setImageFiles((prev) => prev.filter((_, i) => i !== idx));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const uploadImages = async () => {
//     if (imageFiles.length === 0) {
//       setUploadError("اضف صورة واحدة على الاقل");
//       return null;
//     }
//     setUploading(true);
//     setUploadError(null);
//     try {
//       const uploaded = [];
//       for (const file of imageFiles) {
//         const data = new FormData();
//         data.append("image", file);
//         const res = await fetch("/api/user/profile/avatar", {
//           method: "POST",
//           body: data,
//         });
//         const json = await res.json();
//         if (!res.ok) throw new Error(json.message || "فشل رفع الصورة");
//         uploaded.push(json.url);
//       }
//       setUploading(false);
//       return uploaded;
//     } catch (err) {
//       setUploadError(err.message);
//       setUploading(false);
//       return null;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!form.name || !form.description || !form.address || !form.price) {
//       setError("يرجى ملء جميع الحقول المطلوبة");
//       return;
//     }
//     if (!form.bedrooms || !form.bathrooms || !form.area) {
//       setError("يرجى ادخال عدد الغرف ودورات المياه والمساحة");
//       return;
//     }
//     if (form.offer && !form.discountPrice) {
//       setError("يرجى ادخال السعر بعد الخصم");
//       return;
//     }
//     if (form.offer && Number(form.discountPrice) >= Number(form.price)) {
//       setError("سعر الخصم يجب ان يكون اقل من السعر الاصلي");
//       return;
//     }

//     const urls = await uploadImages();
//     if (!urls) return;

//     setLoading(true);
//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         discountPrice: form.offer ? Number(form.discountPrice) : undefined,
//         bedrooms: Number(form.bedrooms),
//         bathrooms: Number(form.bathrooms),
//         area: Number(form.area),
//         imageUrl: urls,
//         userRef: currentUser._id,
//       };
//       const res = await fetch("/api/listing/createListing", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "حدث خطا");
//       navigate(`/listing/${data._id}`);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const labelClass = " flex block text-base font-semibold text-gray-700 mb-2";
//   const inputClass =
//     "  w-full border border-gray-300 rounded-md px-4 py-3 text-base text-gray-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
//   const sectionClass =
//     "  bg-white border border-gray-200 rounded-md p-6 space-y-5";
//   const sectionTitle =
//     " text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-5";

//   return (
//     <div dir="rtl" className=" flex min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">اضافة عقار جديد</h1>
//           <p className="text-base text-gray-500 mt-1">
//             املا البيانات التالية لنشر العقار
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* ===== RIGHT COLUMN ===== */}
//             <div className="space-y-6">
//               {/* Basic Info */}
//               <div className={sectionClass}>
//                 <h2 className={sectionTitle}>المعلومات الاساسية</h2>

//                 <div>
//                   <label className={labelClass}>
//                     اسم العقار <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     placeholder="مثال: شقة في المعادي"
//                     className={inputClass}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelClass}>
//                     الوصف <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     rows={4}
//                     placeholder="اكتب وصفا تفصيليا للعقار..."
//                     className={inputClass + " resize-none"}
//                   />
//                 </div>

//                 <div>
//                   <label className={labelClass}>
//                     العنوان <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={form.address}
//                     onChange={handleChange}
//                     placeholder="مثال: 15 شارع النيل، المعادي، القاهرة"
//                     className={inputClass}
//                   />
//                 </div>
//               </div>

//               {/* Type */}
//               <div className={sectionClass}>
//                 <h2 className={sectionTitle}>نوع العقار</h2>
//                 <div className="flex gap-3 flex-row">
//                   {[
//                     { val: "rent", label: "للايجار" },
//                     { val: "sell", label: "للبيع" },
//                   ].map((t) => (
//                     <button
//                       key={t.val}
//                       type="button"
//                       onClick={() => setForm((p) => ({ ...p, type: t.val }))}
//                       className={`flex-1 py-3 text-base font-semibold rounded-md border transition ${
//                         form.type === t.val
//                           ? "bg-blue-600 text-white border-blue-600"
//                           : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
//                       }`}
//                     >
//                       {t.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Details */}
//               <div className={sectionClass}>
//                 <h2 className={sectionTitle}>تفاصيل العقار</h2>

//                 <div className="grid grid-cols-3 gap-3">
//                   <div>
//                     <label className={labelClass}>
//                       غرف النوم <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="bedrooms"
//                       value={form.bedrooms}
//                       onChange={handleChange}
//                       min={1}
//                       placeholder="0"
//                       className={inputClass}
//                     />
//                   </div>
//                   <div>
//                     <label className={labelClass}>
//                       دورات المياه <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="bathrooms"
//                       value={form.bathrooms}
//                       onChange={handleChange}
//                       min={1}
//                       placeholder="0"
//                       className={inputClass}
//                     />
//                   </div>
//                   <div>
//                     <label className={labelClass}>
//                       المساحة (م²) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="area"
//                       value={form.area}
//                       onChange={handleChange}
//                       min={1}
//                       placeholder="0"
//                       className={inputClass}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Features */}
//               <div className={sectionClass}>
//                 <h2 className={sectionTitle}>المميزات</h2>
//                 <div className="space-y-3">
//                   {[
//                     { name: "furnished", label: "مفروشة" },
//                     { name: "parking", label: "موقف سيارات" },
//                   ].map((feat) => (
//                     <label
//                       key={feat.name}
//                       className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50"
//                     >
//                       <span className="text-base font-medium text-gray-700">
//                         {feat.label}
//                       </span>
//                       <input
//                         type="checkbox"
//                         name={feat.name}
//                         checked={form[feat.name]}
//                         onChange={handleChange}
//                         className="w-5 h-5 accent-blue-600 cursor-pointer"
//                       />
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ===== LEFT COLUMN ===== */}
//             <div className="space-y-6">
//               {/* Pricing */}
//               <div className={sectionClass}>
//                 <h2 className={sectionTitle}>التسعير</h2>

//                 <div>
//                   <label className={labelClass}>
//                     السعر
//                     {form.type === "rent" && (
//                       <span className="text-gray-400 font-normal text-sm mr-1">
//                         (شهريا)
//                       </span>
//                     )}
//                     <span className="text-red-500"> *</span>
//                   </label>
//                   <div className="flex items-center border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
//                     <input
//                       type="number"
//                       name="price"
//                       value={form.price}
//                       onChange={handleChange}
//                       min={0}
//                       placeholder="0"
//                       className="flex-1 px-4 py-3 text-base text-gray-800 bg-transparent outline-none"
//                     />
//                     <span className="px-4 py-3 text-base text-gray-500 border-r border-gray-300 bg-gray-50 rounded-l-md font-medium">
//                       ج.م
//                     </span>
//                   </div>
//                 </div>

//                 <label className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50">
//                   <span className="text-base font-medium text-gray-700">
//                     يوجد عرض / خصم
//                   </span>
//                   <input
//                     type="checkbox"
//                     name="offer"
//                     checked={form.offer}
//                     onChange={handleChange}
//                     className="w-5 h-5 accent-blue-600 cursor-pointer"
//                   />
//                 </label>

//                 {form.offer && (
//                   <div>
//                     <label className={labelClass}>
//                       السعر بعد الخصم <span className="text-red-500">*</span>
//                     </label>
//                     <div className="flex items-center border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
//                       <input
//                         type="number"
//                         name="discountPrice"
//                         value={form.discountPrice}
//                         onChange={handleChange}
//                         min={0}
//                         placeholder="0"
//                         className="flex-1 px-4 py-3 text-base text-gray-800 bg-transparent outline-none"
//                       />
//                       <span className="px-4 py-3 text-base text-gray-500 border-r border-gray-300 bg-gray-50 rounded-l-md font-medium">
//                         ج.م
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Images */}
//               <div className={sectionClass}>
//                 <h2 className={sectionTitle}>
//                   صور العقار
//                   <span className="text-sm font-normal text-gray-400 mr-2">
//                     ({imagePreviews.length}/6)
//                   </span>
//                 </h2>

//                 <label
//                   className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md py-8 cursor-pointer transition ${
//                     imagePreviews.length >= 6
//                       ? "border-gray-200 bg-gray-50 cursor-not-allowed"
//                       : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
//                   }`}
//                 >
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     disabled={imagePreviews.length >= 6}
//                     className="sr-only"
//                   />
//                   <p className="text-base text-gray-600 font-medium">
//                     اضغط لرفع الصور
//                   </p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     PNG, JPG, WEBP — حتى 6 صور
//                   </p>
//                 </label>

//                 {imagePreviews.length > 0 && (
//                   <div className="grid grid-cols-3 gap-2 mt-3">
//                     {imagePreviews.map((src, i) => (
//                       <div
//                         key={i}
//                         className="relative group aspect-square rounded-md overflow-hidden border border-gray-200"
//                       >
//                         <img
//                           src={src}
//                           alt={`preview-${i}`}
//                           className="w-full h-full object-cover"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(i)}
//                           className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl font-bold"
//                         >
//                           X
//                         </button>
//                         {i === 0 && (
//                           <span className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium">
//                             رئيسية
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {uploadError && (
//                   <p className="text-sm text-red-600 mt-2">{uploadError}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {error && (
//             <div className="mt-6 bg-red-50 border border-red-300 rounded-md px-4 py-3 text-base text-red-700">
//               {error}
//             </div>
//           )}

//           <div className="mt-6">
//             <button
//               type="submit"
//               disabled={loading || uploading}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-base font-bold py-4 rounded-md transition"
//             >
//               {loading || uploading
//                 ? uploading
//                   ? "جاري رفع الصور..."
//                   : "جاري النشر..."
//                 : "نشر العقار"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useSearchParams } from "react-router-dom";
import ListingHeader from "../Components/Listing/ListingHeader.jsx";
import BasicInfoSection from "../Components/Listing/BasicInformation.jsx";
import PropertyTypeSection from "../Components/Listing/PropertyTypeSection.jsx";
import PropertyDetailsSection from "../Components/Listing/PropertyDetailsSection.jsx";
import PricingSection from "../Components/Listing/PercingSection.jsx";
import FeaturesSection from "../Components/Listing/FeaturesSectio.jsx";
import ImageUploader from "../Components/Listing/ImageUploader.jsx";
import SubmitSection from "../Components/Listing/Submitsection.jsx";
import useListingForm from "../Hooks/useListingForm";

export default function CreateListing() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const listing = useListingForm({ editId });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <ListingHeader isEdit={Boolean(editId)} />

        <form onSubmit={listing.handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Right Side */}

            <div className="space-y-8">
              <BasicInfoSection
                form={listing.form}
                handleChange={listing.handleChange}
                errors={listing.errors}
              />

              <PropertyTypeSection
                form={listing.form}
                setForm={listing.setForm}
              />

              <PropertyDetailsSection
                form={listing.form}
                handleChange={listing.handleChange}
                errors={listing.errors}
              />
            </div>

            {/* Left Side */}

            <div className="space-y-8">
              <PricingSection
                form={listing.form}
                handleChange={listing.handleChange}
                errors={listing.errors}
              />

              <FeaturesSection
                form={listing.form}
                handleChange={listing.handleChange}
              />

              <ImageUploader
                imageFiles={listing.imageFiles}
                imagePreviews={listing.imagePreviews}
                setImageFiles={listing.setImageFiles}
                setImagePreviews={listing.setImagePreviews}
                handleImageSelect={listing.handleImageSelect}
                removeImage={listing.removeImage}
                uploading={listing.uploading}
                uploadProgress={listing.uploadProgress}
                uploadError={listing.uploadError}
              />
            </div>
          </div>

          <SubmitSection
            loading={listing.loading}
            uploading={listing.uploading}
            progress={listing.progress}
            error={listing.error}
            isEdit={Boolean(editId)}
          />
        </form>
      </div>
    </div>
  );
}
