import express from "express";

import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    getPublishedPosts,
    deletePost
} from "../controllers/postController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/", getPublishedPosts);

// Admin
router.post("/", authenticate, authorizeAdmin, createPost);
router.put("/:id", authenticate, authorizeAdmin, updatePost);
router.patch("/:id/publish", authenticate, authorizeAdmin, getPublishedPosts);
router.delete("/:id", authenticate, authorizeAdmin, deletePost);

export default router;