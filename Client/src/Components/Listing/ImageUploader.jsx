import { useRef } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ImageUploader({
  imageFiles,
  imagePreviews,
  setImageFiles,
  setImagePreviews,
  uploading,
  uploadProgress,
  uploadError,
}) {
  const inputRef = useRef();

  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const totalImages = imageFiles.length + files.length;

    if (totalImages > 7) {
      alert("يمكنك رفع 7 صور كحد أقصى");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">صور العقار</h2>

      <input
        ref={inputRef}
        hidden
        multiple
        accept="image/*"
        type="file"
        onChange={handleSelectImages}
      />

      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="w-full border-2 border-dashed border-blue-300 rounded-2xl py-10 hover:bg-blue-50 transition"
      >
        <Upload className="mx-auto text-blue-600 mb-3" size={42} />

        <p className="font-semibold text-lg">اختر صور العقار</p>
        <p className="text-sm text-gray-500 mt-2">JPG - PNG - WEBP</p>
        <p className="text-xs text-gray-400 mt-2">حتى 7 صور</p>
      </button>

      {uploadError && (
        <p className="text-red-500 mt-4 text-sm">{uploadError}</p>
      )}

      {uploading && (
        <div className="mt-5">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">جارى رفع الصور...</span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="bg-blue-600 h-3 rounded-full transition-all"
            />
          </div>
        </div>
      )}

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {imagePreviews.map((image, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden border"
            >
              <img src={image} alt="" className="w-full h-44 object-cover" />

              {index === 0 && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                  الرئيسية
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {imagePreviews.length < 7 && (
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="border-2 border-dashed rounded-2xl flex flex-col justify-center items-center h-44 hover:bg-gray-50 transition"
            >
              <ImageIcon size={35} className="text-gray-400" />
              <span className="mt-3 text-gray-500">إضافة صور</span>
            </button>
          )}
        </div>
      )}

      {uploading && (
        <div className="flex justify-center mt-5">
          <Loader2 className="animate-spin text-blue-600" size={28} />
        </div>
      )}
    </motion.div>
  );
}

export function ProfileImageUploader({
  profileImageFile,
  profileImagePreview,
  setProfileImageFile,
  setProfileImagePreview,
  uploading,
  uploadProgress,
  uploadError,
}) {
  const inputRef = useRef();

  const handleSelectProfileImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">صورة البروفيل</p>
          <p className="text-xs text-gray-500">
            اختر صورة واضحة لعرضها بشكل احترافي
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Camera size={16} />
          تغيير
        </button>
      </div>

      <input
        ref={inputRef}
        hidden
        accept="image/*"
        type="file"
        onChange={handleSelectProfileImage}
      />

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-blue-200 bg-white shadow-sm">
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Upload size={24} className="text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          {profileImageFile ? (
            <p className="text-sm text-gray-700">
              تم اختيار: {profileImageFile.name}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              سيتم عرض الصورة هنا قبل الحفظ
            </p>
          )}

          {uploading && (
            <div className="mt-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
          )}
        </div>
      </div>

      {profileImagePreview && (
        <button
          type="button"
          onClick={() => {
            setProfileImageFile(null);
            setProfileImagePreview(null);
          }}
          className="mt-4 inline-flex items-center gap-2 text-sm text-red-600 transition hover:text-red-700"
        >
          <Trash2 size={16} />
          حذف الصورة المختارة
        </button>
      )}
    </div>
  );
}
