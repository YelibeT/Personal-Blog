import prisma from "../lib/prisma.js";

export const getAdminPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to fetch admin posts:", error);

    res.status(500).json({
      error: "Failed to fetch posts"
    });
  }
};


export const getAdminPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid post ID"
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id
      }
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found"
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);

    res.status(500).json({
      error: "Failed to fetch post"
    });
  }
};


export const createAdminPost = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      excerpt,
      coverImage,
      published
    } = req.body;

    const post = await prisma.post.create({
      data: {
        title: title?.trim() || null,
        content: content?.trim() || null,
        category: category?.trim() || "Personal",
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage || null,
        published: published === true,
        authorId: req.user.userId
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Failed to create post:", error);

    res.status(500).json({
      error: "Failed to create post"
    });
  }
};


export const updateAdminPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid post ID"
      });
    }

    const {
      title,
      content,
      category,
      excerpt,
      coverImage,
      published
    } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: {
        id
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        error: "Post not found"
      });
    }

    const post = await prisma.post.update({
      where: {
        id
      },
      data: {
        title: title?.trim() || null,
        content: content?.trim() || null,
        category: category?.trim() || "Personal",
        excerpt: excerpt?.trim() || null,
        coverImage: coverImage || null,
        published: published === true
      }
    });

    res.status(200).json(post);
  } catch (error) {
    console.error("Failed to update post:", error);

    res.status(500).json({
      error: "Failed to update post"
    });
  }
};


export const deleteAdminPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid post ID"
      });
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        error: "Post not found"
      });
    }

    await prisma.post.delete({
      where: {
        id
      }
    });

    res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete post:", error);

    res.status(500).json({
      error: "Failed to delete post"
    });
  }
};