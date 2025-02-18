import express from "express";
const router = express.Router();
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { addDepartment, getEditDepartment, getDepartments, UpdateEditDepartment, deleteDepartment } from "../controller/departmentController.js";

router.get('/', jwtAuthMiddleware, getDepartments)
router.post('/add', jwtAuthMiddleware, addDepartment)
router.get('/:id', jwtAuthMiddleware, getEditDepartment)
router.put('/:id', jwtAuthMiddleware, UpdateEditDepartment)
router.delete('/:id', jwtAuthMiddleware, deleteDepartment)

export default router