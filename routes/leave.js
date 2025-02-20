import express from "express";
const router = express.Router();
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave } from "../controller/leaveController.js";

router.post('/add', jwtAuthMiddleware, addLeave);
router.get('/:id', jwtAuthMiddleware, getLeave);
router.get('/detail/:id', jwtAuthMiddleware, getLeaveDetail);
router.get('/', jwtAuthMiddleware, getLeaves);
router.put('/:id', jwtAuthMiddleware, updateLeave);
export default router;