import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminPostRoutes from "./routes/adminPostRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin/posts", adminPostRoutes);

const PORT = 8800;

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION:", error);
});