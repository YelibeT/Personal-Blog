import cloudinary from '../cloudinary.js';
import prisma from '../lib/prisma.js';

const startTime = performance.now();

const uploadController = async (req, res) => {
    try {
        const file =
            req.files?.file?.[0] ||
            req.files?.coverImage?.[0] ||
            req.files?.image?.[0];
        const folders = {
            blog_profile: "blog/profiles",
            user_profile: "users/profiles",
            blog_document: "blog/documents"
        };

        const folder = folders[req.body.purpose];
        if (!folder) {
            return res.status(400).json({
                message: "Invalid upload purpose"
            });
        }
        if (!file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const postId = req.body.purpose === "blog_document"
            ? Number(req.body.postId)
            : null;

        if (req.body.purpose === "blog_document" &&
            (!Number.isInteger(postId) || postId <= 0)) {
            return res.status(400).json({
                message: "A valid postId is required"
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

            stream.end(file.buffer)
        });

        const attachment = req.body.purpose === "blog_document"
            ? await prisma.attachment.create({
                data: {
                    fileName: file.originalname,
                    fileUrl: result.secure_url,
                    publicId: result.public_id,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    postId
                }
            })
            : null;


        return res.status(200).json({
            message: "File uploaded successfully",
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            ...(attachment || {})
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export default uploadController