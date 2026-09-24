import cloudinary from "../../config/cloudinary.js";

export const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
         folder,
          transformation: [
            {  width: 1600,
          height: 1200,
              crop: "limit"
            },
            {  quality: "auto",
          fetch_format: "auto"}
          ]
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      )
      .end(file.buffer);
  });
};


export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const images = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file, "RealEstate/properties")
      )
    );

    return res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
        message: error.message,
      stack: error.stack,
    });
  }
};