import express from "express";

import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorizeAdmin,
    upload.single("image"),
    uploadImage
);

export default router;