import app from "./server.js";

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});