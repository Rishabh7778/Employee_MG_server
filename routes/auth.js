import express from "express";
import { login, verify, refreshTokenHandler } from "../controller/authController.js";
import { jwtAuthMiddleware } from "../middleware/jwt.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", jwtAuthMiddleware, verify);
router.post("/refresh", refreshTokenHandler);

export default router;
