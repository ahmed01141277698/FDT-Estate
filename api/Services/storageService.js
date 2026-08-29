export class StorageService {
  static async uploadFile(
    file,
    { folder, allowedMimeTypes = [], maxSizeBytes = 10 * 1024 * 1024 },
  ) {
    const mimeType = file?.mimetype || "";
    if (allowedMimeTypes.length && !allowedMimeTypes.includes(mimeType)) {
      const error = new Error("نوع الملف غير مسموح به.");
      error.code = "INVALID_FILE_TYPE";
      throw error;
    }

    if (file?.size && file.size > maxSizeBytes) {
      const error = new Error("حجم الملف أكبر من الحد المسموح.");
      error.code = "FILE_TOO_LARGE";
      throw error;
    }

    return {
      url: file?.path || "",
      storageProvider: "local",
      publicId: file?.originalname || "",
      originalFilename: file?.originalname || "",
      mimeType,
      size: file?.size || 0,
      folder,
    };
  }

  static async deleteFile(record) {
    if (!record || !record.publicId) return true;
    return true;
  }
}

export default StorageService;
