export const deleteImage = async (publicId) => {
 return await cloudinary.uploader.destroy(publicId);
};

export const deleteImages = async (publicIds) => {
    return await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
}