import express from 'express'
import multer from 'multer';
import uploadController from '../controllers/uploadController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const upload = multer({})
const router = express.Router()

router.post("/", authenticate, authorizeAdmin, upload.single("file"), uploadController);

export default router