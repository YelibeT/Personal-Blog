import prisma from "../lib/prisma.js"

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
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

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
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, published } = req.body

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published ?? false,
                authorId: req.user.userId,
            },
        })

        res.status(201).json(post);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await prisma.post.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content
            }
        });

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update post" })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.post.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete post" })
    }
}