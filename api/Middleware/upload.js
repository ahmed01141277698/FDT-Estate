import multer from "multer";

// i used memorystorage , becuase i want to store the file in memory as a buffer, rather than saving it to disk. This is useful when you want to process the file immediately after it's uploaded, without having to read it from disk first. [react > express > nodejs > cloudinary ]
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"), false);
    } if (file.mimetype === "image/svg+xml" || file.mimetype === "image/svg") {
        return cb(new Error("SVG files are not allowed"), false);
    }
        cb(null, true);
   
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});
 
export default upload;