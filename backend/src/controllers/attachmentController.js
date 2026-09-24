import prisma from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "personal-blog/attachments",
        resource_type: "raw"
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

export const uploadAttachment = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        error: "Post ID is required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file provided."
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postId)
      }
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found."
      });
    }

    const result = await uploadToCloudinary(req.file);

    const attachment = await prisma.attachment.create({
      data: {
        fileName: req.file.originalname,
        fileUrl: result.secure_url,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        postId: parseInt(postId)
      }
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error("ATTACHMENT UPLOAD ERROR:", error);

    res.status(500).json({
      error: "Failed to upload attachment.",
      message: error.message
    });
  }
};

export const getPostAttachments = async (req, res) => {
  try {
    const { postId } = req.params;

    const attachments = await prisma.attachment.findMany({
      where: {
        postId: parseInt(postId)
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    res.status(200).json(attachments);
  } catch (error) {
    console.error("GET ATTACHMENTS ERROR:", error);

    res.status(500).json({
      error: "Failed to fetch attachments."
    });
  }
};

export const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;

    const attachment = await prisma.attachment.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!attachment) {
      return res.status(404).json({
        error: "Attachment not found."
      });
    }

    await prisma.attachment.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(200).json({
      message: "Attachment deleted successfully."
    });
  } catch (error) {
    console.error("DELETE ATTACHMENT ERROR:", error);

    res.status(500).json({
      error: "Failed to delete attachment."
    });
  }
};