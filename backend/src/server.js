import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminPostRoutes from "./routes/adminPostRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = new Set([
        "http://localhost:5173",
        "https://personal-blog-jade-nine.vercel.app",
        "https://personal-blog-yelibets-projects.vercel.app",
        "https://biniyam-personalblog.vercel.app",
        process.env.FRONTEND_URL
      ].filter(Boolean));

      const isAllowed =
        !origin ||
        allowedOrigins.has(origin) ||
        /^https:\/\/personal-blog-[a-z0-9-]+\.vercel\.app$/.test(origin);

      callback(null, isAllowed);
    },
    credentials: true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin/posts", adminPostRoutes);

app.get(["/admin", "/admin/"], (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    "https://biniyam-personalblog.vercel.app";

  res.redirect(307, `${frontendUrl}/admin`);
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "API is working",
  });
});

export default app;