// import { useSearchParams } from "react-router-dom";
// import ListingHeader from "../Components/Listing/ListingHeader.jsx";
// import BasicInfoSection from "../Components/Listing/BasicInformation.jsx";
// import PropertyTypeSection from "../Components/Listing/PropertyTypeSection.jsx";
// import PropertyDetailsSection from "../Components/Listing/PropertyDetailsSection.jsx";
// import PricingSection from "../Components/Listing/PercingSection.jsx";
// import FeaturesSection from "../Components/Listing/FeaturesSectio.jsx";
// import ImageUploader from "../Components/Listing/ImageUploader.jsx";
// import SubmitSection from "../Components/Listing/Submitsection.jsx";
// import useListingForm from "../Hooks/useListingForm";

// export default function CreateListing() {
//   const [searchParams] = useSearchParams();
//   const editId = searchParams.get("edit");
//   const listing = useListingForm({ editId });

//   return (
//     <div dir="rtl" className="min-h-screen bg-[#f7f5f0] py-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <ListingHeader isEdit={Boolean(editId)} />

//         <form onSubmit={listing.handleSubmit}>
//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* Right Side */}

//             <div className="space-y-8">
//               <BasicInfoSection
//                 form={listing.form}
//                 handleChange={listing.handleChange}
//                 errors={listing.errors}
//               />

//               <PropertyTypeSection
//                 form={listing.form}
//                 setForm={listing.setForm}
//               />

//               <PropertyDetailsSection
//                 form={listing.form}
//                 handleChange={listing.handleChange}
//                 errors={listing.errors}
//               />
//             </div>

//             {/* Left Side */}

//             <div className="space-y-8">
//               <PricingSection
//                 form={listing.form}
//                 handleChange={listing.handleChange}
//                 errors={listing.errors}
//               />

//               <FeaturesSection
//                 form={listing.form}
//                 handleChange={listing.handleChange}
//               />

//               <ImageUploader
//                 imageFiles={listing.imageFiles}
//                 imagePreviews={listing.imagePreviews}
//                 setImageFiles={listing.setImageFiles}
//                 setImagePreviews={listing.setImagePreviews}
//                 handleImageSelect={listing.handleImageSelect}
//                 removeImage={listing.removeImage}
//                 uploading={listing.uploading}
//                 uploadProgress={listing.uploadProgress}
//                 uploadError={listing.uploadError}
//               />
//             </div>
//           </div>

//           <SubmitSection
//             loading={listing.loading}
//             uploading={listing.uploading}
//             progress={listing.progress}
//             error={listing.error}
//             isEdit={Boolean(editId)}
//           />
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Eye } from "lucide-react";
import ListingHeader from "../Components/Listing/ListingHeader.jsx";
import BasicInfoSection from "../Components/Listing/BasicInformation.jsx";
import PropertyTypeSection from "../Components/Listing/PropertyTypeSection.jsx";
import PropertyDetailsSection from "../Components/Listing/PropertyDetailsSection.jsx";
import PricingSection from "../Components/Listing/PercingSection.jsx";
import FeaturesSection from "../Components/Listing/FeaturesSectio.jsx";
import ImageUploader from "../Components/Listing/ImageUploader.jsx";
import SubmitSection from "../Components/Listing/Submitsection.jsx";
import ListingPreviewModal from "../Components/Listing/PreviewListing.jsx";
import useListingForm from "../Hooks/useListingForm";

export default function CreateListing() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const listing = useListingForm({ editId });
  const { currentUser } = useSelector((state) => state.user || {});

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f5f0] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <ListingHeader isEdit={Boolean(editId)} />

        <form onSubmit={listing.handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
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

          {/* زرار المعاينة — قبل النشر النهائي، بيوري شكل الإعلان زي ما هيبان فعليًا */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 text-sm font-bold text-[#183d37] transition hover:bg-white"
            style={{ borderColor: "rgba(24,61,55,0.2)" }}
          >
            <Eye size={18} className="text-[#c9a227]" />
            معاينة الإعلان قبل النشر
          </button>

          <SubmitSection
            loading={listing.loading}
            uploading={listing.uploading}
            progress={listing.progress}
            error={listing.error}
            isEdit={Boolean(editId)}
          />
        </form>
      </div>

      {showPreview && (
        <ListingPreviewModal
          form={listing.form}
          imagePreviews={listing.imagePreviews}
          posterName={currentUser?.username}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
