import prisma from "../lib/prisma.js"

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body

        const post = await prisma.post.create({
            data: {
                title,
                content
            },
        })

        res.status(201).json(post);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" })
    }

    
}