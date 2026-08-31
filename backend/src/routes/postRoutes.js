import express from "express";

import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    publishPost,
    deletePost
} from "../controllers/postController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPost);

// Admin
router.post("/", authenticate, authorizeAdmin, createPost);
router.put("/:id", authenticate, authorizeAdmin, updatePost);
router.patch("/:id/publish", authenticate, authorizeAdmin, publishPost);
router.delete("/:id", authenticate, authorizeAdmin, deletePost);

export default router;