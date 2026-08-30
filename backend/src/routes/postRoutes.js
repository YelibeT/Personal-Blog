import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";
import express from "express";
import { createPost, getPosts, getPost, updatePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPost);

// Admin only
router.post("/", authenticate, authorizeAdmin, createPost);
router.put("/:id", authenticate, authorizeAdmin, updatePost);
router.delete("/:id", authenticate, authorizeAdmin, deletePost);

export default router;