import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const initialForm = {
  name: "",
  description: "",
  address: "",
  price: "",
  discountPrice: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  furnished: false,
  parking: false,
  type: "rent",
  offer: false,
  imageUrl: [],
};

export default function useListingForm() {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  // ===========================
  // Form States
  // ===========================

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  // ===========================
  // Images
  // ===========================

  const [imageFiles, setImageFiles] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);

  // ===========================
  // Loading
  // ===========================

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  // ===========================
  // Messages
  // ===========================

  const [error, setError] = useState("");

  const [uploadError, setUploadError] = useState("");

  // ===========================
  // Progress
  // ===========================

  const progress = useMemo(() => {
    let completed = 0;

    if (form.name.trim()) completed++;

    if (form.description.trim()) completed++;

    if (form.address.trim()) completed++;

    if (form.price) completed++;

    if (form.bedrooms) completed++;

    if (form.bathrooms) completed++;

    if (form.area) completed++;

    if (imageFiles.length > 0) completed++;

    if (form.offer) {
      if (form.discountPrice) completed++;
    } else {
      completed++;
    }

    return Math.round((completed / 9) * 100);
  }, [form, imageFiles]);
    
    // ===========================
  // Handle Inputs
  // ===========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
  };

  // ===========================
  // Handle Images
  // ===========================

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (imageFiles.length + files.length > 7) {
      setUploadError("يمكنك رفع 7 صور كحد أقصى");
      return;
    }

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      setUploadError("يسمح برفع الصور فقط");
      return;
    }

    setUploadError("");

    setImageFiles((prev) => [...prev, ...validFiles]);

    const previews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  // ===========================
  // Remove Image
  // ===========================

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ===========================
  // Reset Form
  // ===========================

  const resetForm = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setForm(initialForm);

    setErrors({});

    setImageFiles([]);

    setImagePreviews([]);

    setLoading(false);

    setUploading(false);

    setUploadProgress(0);

    setError("");

    setUploadError("");
    };
    // ===========================
  // Upload Images
  // ===========================

  const uploadImages = async () => {
    if (imageFiles.length === 0) {
      throw new Error("يرجى اختيار صورة واحدة على الأقل");
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const { data } = await axios.post(
        "/api/upload/upload",
        formData,
        {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );

            setUploadProgress(percent);
          },
        }
      );

      setUploading(false);

      return data.images.map((image) => image.url);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);

      throw new Error(
        error.response?.data?.message ||
          "حدث خطأ أثناء رفع الصور"
      );
    }
  };

  // ===========================
  // Validate Form
  // ===========================

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim())
      newErrors.name = "اسم العقار مطلوب";

    if (!form.description.trim())
      newErrors.description = "الوصف مطلوب";

    if (!form.address.trim())
      newErrors.address = "العنوان مطلوب";

    if (!form.price)
      newErrors.price = "السعر مطلوب";

    if (!form.bedrooms)
      newErrors.bedrooms = "عدد الغرف مطلوب";

    if (!form.bathrooms)
      newErrors.bathrooms = "عدد الحمامات مطلوب";

    if (!form.area)
      newErrors.area = "المساحة مطلوبة";

    if (form.offer) {
      if (!form.discountPrice) {
        newErrors.discountPrice =
          "أدخل سعر الخصم";
      }

      if (
        Number(form.discountPrice) >=
        Number(form.price)
      ) {
        newErrors.discountPrice =
          "سعر الخصم يجب أن يكون أقل من السعر الأساسي";
      }
    }

    if (imageFiles.length === 0) {
      setUploadError("اختر صورة واحدة على الأقل");
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0 &&
      imageFiles.length > 0
    );
    };
    // ===========================
  // Handle Submit
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Upload Images First
      const imageUrls = await uploadImages();

      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.offer
          ? Number(form.discountPrice)
          : 0,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        imageUrl: imageUrls,
        userRef: currentUser._id,
      };

      const response = await axios.post(
        "/api/listing/createListing",
        payload,
        {
          withCredentials: true,
        }
      );

      resetForm();

      navigate(`/listing/${response.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء إنشاء العقار"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Return
  // ===========================

  return {
    form,
    setForm,

    errors,

    loading,
    uploading,

    uploadProgress,
    progress,

    error,
    uploadError,

    imageFiles,
    imagePreviews,

    setImageFiles,
    setImagePreviews,

    handleChange,
    handleImageSelect,
    removeImage,
    handleSubmit,
    resetForm,
  };
}