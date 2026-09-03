import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminPostRoutes from "./routes/adminPostRoutes.js";

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = new Set([
      "http://localhost:5173",
      "https://personal-blog-jade-nine.vercel.app",
      "https://personal-blog-yelibets-projects.vercel.app",
      "https://biniyam-personalblog.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean));

    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

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