import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image provided."
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "personal-blog/profiles"
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

    const user = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        profileImage: result.secure_url
      }
    });

    res.status(200).json({
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to upload profile image."
    });
  }
};