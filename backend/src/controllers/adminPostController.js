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
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch posts"
        });
    }
};


export const getAdminPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
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

        if (!title || !content) {
            return res.status(400).json({
                error: "Title and content are required"
            });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                category: category || "Personal",
                excerpt: excerpt || null,
                coverImage: coverImage || null,
                published: published || false,
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


export const updateAdminPost = async (req, res) => {
    try {
        const { id } = req.params;

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
                id: parseInt(id)
            }
        });

        if (!existingPost) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        const post = await prisma.post.update({
            where: {
                id: parseInt(id)
            },
            data: {
                title,
                content,
                category,
                excerpt,
                coverImage,
                published
            }
        });

        res.status(200).json(post);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update post"
        });
    }
};


export const deleteAdminPost = async (req, res) => {
    try {
        const { id } = req.params;

        const existingPost = await prisma.post.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingPost) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

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

        res.status(500).json({
            error: "Failed to delete post"
        });
    }
};