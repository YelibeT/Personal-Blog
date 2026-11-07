import express from "express";

import {
    login,
    refreshAccessToken,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

router.post("/login", login);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logout);

router.use(authenticate);
router.use(authorizeAdmin);

router.get("/me", getCurrentUser);
router.put("/profile", updateProfile);
router.put("/password", changePassword);

export default router;