import express from "express";
const router = express.Router();
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { changePassword } from "../controller/settingControlller.js";

router.put('/change-password', jwtAuthMiddleware, changePassword )


export default router;