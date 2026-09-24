import express from "express";

import {authenticate} from "../middleware/authenticate.js";
import {authorizeAdmin} from "../middleware/authorizeAdmin.js";
import fileUpload from "../middleware/fileUpload.js";

import {
  uploadAttachment,
  getPostAttachments,
  deleteAttachment
} from "../controllers/attachmentController.js";

const router = express.Router();

router.get(
  "/post/:postId",
  authenticate,
  authorizeAdmin,
  getPostAttachments
);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  fileUpload.single("file"),
  uploadAttachment
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteAttachment
);

export default router;