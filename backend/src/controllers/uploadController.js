import cloudinary from '../cloudinary.js';

const startTime = performance.now();



const uploadController = async (req, res) => {
    try {
        const folders = {
            blog_profile: "blog/profiles",
            user_profile: "users/profiles",
            blog_document: "blog/documents"
        };

        const folder = folders[req.body.purpose];
        console.log(req.body)
        console.log(req.body.purpose)
        if (!folder) {
            return res.status(400).json({
                message: "Invalid upload purpose"
            });
        }
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "auto"
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

        return res.status(200).json({
            message: "File uploaded successfully",
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const endTime = performance.now();

console.log(`Upload took: ${(endTime - startTime).toFixed(2)} ms`);

export default uploadController