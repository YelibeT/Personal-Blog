import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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