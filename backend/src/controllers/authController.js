import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const publicUser = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    bio: user.bio,
    profileImage: user.profileImage,
    createdAt: user.createdAt
});

export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user || user.role !== "ADMIN") {
            return res.status(404).json({ error: "Admin profile not found" });
        }

        res.status(200).json(publicUser(user));
    } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        res.status(500).json({ error: "Failed to fetch admin profile" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { displayName, bio, profileImage } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                displayName: typeof displayName === "string" ? displayName.trim() || null : null,
                bio: typeof bio === "string" ? bio.trim() || null : null,
                profileImage: typeof profileImage === "string" ? profileImage.trim() || null : null
            }
        });

        res.status(200).json(publicUser(user));
    } catch (error) {
        console.error("Failed to update admin profile:", error);
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Admin profile not found" });
        }
        res.status(500).json({ error: "Failed to update admin profile" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current and new passwords are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters" });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user || user.role !== "ADMIN") {
            return res.status(404).json({ error: "Admin profile not found" });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        const passwordHash = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash, refreshToken: null }
        });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Failed to change password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                error: "Admin access required"
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // No expiration
        const refreshToken = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_REFRESH_SECRET
        );

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken
            }
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 365 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            accessToken
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Login failed"
        });
    }
};


export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: "Admin session not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                error: "Invalid admin session"
            });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                error: "Admin access required"
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        res.status(200).json({
            accessToken
        });

    } catch (error) {
        console.error(error);

        res.status(401).json({
            error: "Admin session is invalid"
        });
    }
};


export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await prisma.user.updateMany({
                where: {
                    refreshToken
                },
                data: {
                    refreshToken: null
                }
            });
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Logout failed"
        });
    }
};