import express from "express";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Blog API is running" });
});

const PORT = 8800;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});