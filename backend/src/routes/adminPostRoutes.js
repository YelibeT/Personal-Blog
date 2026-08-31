import express from "express";

import {
    getAdminPosts,
    getAdminPost,
    createAdminPost,
    updateAdminPost,
    deleteAdminPost
} from "../controllers/adminPostController.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get("/", getAdminPosts);

router.get("/:id", getAdminPost);

router.post("/", createAdminPost);

router.put("/:id", updateAdminPost);

router.delete("/:id", deleteAdminPost);

export default router;