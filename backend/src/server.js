import express from "express";
import postRoutes from "./routes/postRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});