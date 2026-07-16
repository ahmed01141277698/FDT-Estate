import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// حذف صورة واحدة
export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

// حذف أكثر من صورة
export const deleteImages = async (publicIds) => {
  return await Promise.all(
    publicIds.map((id) => cloudinary.uploader.destroy(id))
  );
};

export default cloudinary;