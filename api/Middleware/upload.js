import multer from "multer";

// i used memorystorage , becuase i want to store the file in memory as a buffer, rather than saving it to disk. This is useful when you want to process the file immediately after it's uploaded, without having to read it from disk first. [react > express > nodejs > cloudinary ]
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});
 
export default upload;