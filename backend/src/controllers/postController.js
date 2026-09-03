import prisma from "../lib/prisma.js";

// GET all published posts
export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json(posts);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch posts"
        });
    }
};

// GET one published post
export const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(id),
                published: true
            }
        });

        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.status(200).json(post);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch post"
        });
    }
};

// CREATE post - Admin only
export const createPost = async (req, res) => {
    try {
        const {
            title,
            content,
            category,
            excerpt,
            coverImage,
            published
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content are required."
            });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                category: category || "Personal",
                excerpt: excerpt || null,
                coverImage: coverImage || null,
                published: published === true,
                authorId: req.user.userId
            }
        });

        res.status(201).json(post);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create post"
        });
    }
};

// UPDATE post - Admin only
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content are required."
            });
        }

        const post = await prisma.post.update({
            where: {
                id: parseInt(id)
            },
            data: {
                title,
                content
            }
        });

        res.status(200).json(post);
    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.status(500).json({
            error: "Failed to update post"
        });
    }
};

// PUBLISH / UNPUBLISH post - Admin only


export const getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to fetch published posts:", error);

    res.status(500).json({
      error: "Failed to fetch posts"
    });
  }
};

// DELETE post - Admin only
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.post.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        res.status(500).json({
            error: "Failed to delete post"
        });
    }
};