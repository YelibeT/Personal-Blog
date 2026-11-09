import express from "express";

import {
    login,
    refreshAccessToken,
    getCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

router.post("/login", login);

router.post("/refresh", refreshAccessToken);


router.use(authenticate);
router.use(authorizeAdmin);

router.get("/me", getCurrentUser);


export default router;