import express from "express";

import upload from "../middleware/upload.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";
import { uploadProfileImage } from "../controllers/profileController.js";

const router = express.Router();

router.put(
  "/image",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  uploadProfileImage
);

export default router;