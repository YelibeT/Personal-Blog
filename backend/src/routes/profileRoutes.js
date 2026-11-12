
import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  getPublicProfile,
  getProfile,
  updateProfile
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/public", getPublicProfile);
router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);

export default router;
