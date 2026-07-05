import { useEffect, useMemo, useState } from "react";
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

export default function useListingForm({ editId = null, initialData = null } = {}) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem("listingForm");
    if (initialData) return { ...initialForm, ...initialData };
    return savedForm ? JSON.parse(savedForm) : initialForm;
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    localStorage.setItem("listingForm", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (!editId) return;

    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/api/listing/${editId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        setForm({
          ...initialForm,
          ...data,
          price: data.price?.toString() || "",
          discountPrice: data.discountPrice?.toString() || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          area: data.area?.toString() || "",
        });
        setExistingImages(data.imageUrl || []);
        setImagePreviews((data.imageUrl || []).map((item) => item.url));
      } catch (err) {
        setError(err.response?.data?.message || err.message || "تعذر تحميل العقار");
      }
    };

    fetchListing();
  }, [editId]);

  const progress = useMemo(() => {
    let completed = 0;

    if (form.name.trim()) completed++;
    if (form.description.trim()) completed++;
    if (form.address.trim()) completed++;
    if (form.price) completed++;
    if (form.bedrooms) completed++;
    if (form.bathrooms) completed++;
    if (form.area) completed++;
    if (imageFiles.length > 0 || existingImages.length > 0 || imagePreviews.length > 0) completed++;
    if (form.offer) {
      if (form.discountPrice) completed++;
    } else {
      completed++;
    }

    return Math.round((completed / 9) * 100);
  }, [form, imageFiles, existingImages.length, imagePreviews.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (imageFiles.length + files.length > 7) {
      setUploadError("يمكنك رفع 7 صور كحد أقصى");
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      setUploadError("يسمح برفع الصور فقط");
      return;
    }

    setUploadError("");
    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    if (index >= 0 && index < imagePreviews.length) {
      const item = imagePreviews[index];
      if (typeof item === "string" && item.startsWith("blob:")) {
        URL.revokeObjectURL(item);
      }
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    if (index >= 0 && index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    imagePreviews.forEach((url) => {
      if (typeof url === "string" && url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    setForm(initialForm);
    setErrors({});
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setLoading(false);
    setUploading(false);
    setUploadProgress(0);
    setError("");
    setUploadError("");
    localStorage.removeItem("listingForm");
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) {
      if (existingImages.length > 0) return existingImages;
      throw new Error("يرجى اختيار صورة واحدة على الأقل");
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const { data } = await axios.post("/api/upload/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setUploading(false);
      return (data.images || []).map((image) => ({ url: image.url, public_id: image.public_id }));
    } catch (err) {
      setUploading(false);
      setUploadProgress(0);
      throw new Error(err.response?.data?.message || "حدث خطأ أثناء رفع الصور");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "اسم العقار مطلوب";
    if (!form.description.trim()) newErrors.description = "الوصف مطلوب";
    if (!form.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!form.price) newErrors.price = "السعر مطلوب";
    if (!form.bedrooms) newErrors.bedrooms = "عدد الغرف مطلوب";
    if (!form.bathrooms) newErrors.bathrooms = "عدد الحمامات مطلوب";
    if (!form.area) newErrors.area = "المساحة مطلوبة";

    if (form.offer) {
      if (!form.discountPrice) {
        newErrors.discountPrice = "أدخل سعر الخصم";
      }
      if (Number(form.discountPrice) >= Number(form.price)) {
        newErrors.discountPrice = "سعر الخصم يجب أن يكون أقل من السعر الأساسي";
      }
    }

    if (imageFiles.length === 0 && existingImages.length === 0) {
      setUploadError("اختر صورة واحدة على الأقل");
    } else {
      setUploadError("");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && (imageFiles.length > 0 || existingImages.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const imageUrls = await uploadImages();

      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.offer ? Number(form.discountPrice || 0) : 0,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        imageUrl: imageUrls,
        userRef: currentUser?._id,
      };

      if (editId) {
        await axios.put(`/api/listing/${editId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      } else {
        await axios.post("/api/listing/createListing", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }

      resetForm();
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "حدث خطأ أثناء حفظ العقار");
    } finally {
      setLoading(false);
    }
  };

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