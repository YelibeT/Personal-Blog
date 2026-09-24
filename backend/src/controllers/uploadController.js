import cloudinary from "../lib/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No image provided."
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "personal-blog"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.status(200).json({
            imageUrl: result.secure_url
        });

    } catch (error) {
  console.error("CLOUDINARY UPLOAD ERROR:", error);

  return res.status(500).json({
    error: "Upload failed",
    message: error.message
  });
}
};