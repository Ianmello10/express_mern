import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { asyncHandler } from "../middleware/asyncHandler";
import AuthController from "../controllers/authController";
import { verifyRefreshToken } from "../middleware/verifyRefreshToken";

const router = express.Router();

router.post("/login", asyncHandler(AuthController.login));
router.post("/logout", asyncHandler(AuthController.logout));
router.get(
	"/token",
	verifyRefreshToken,
	asyncHandler(AuthController.refreshToken),
);

//router.get('/profile',verifyToken,profileController)

export default router;
