import express from "express";
const router = express.Router();
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { addEmployee, getEmployee, upload, getEmployeeOne, editEmployee, fetchEmployeeByDepId } from "../controller/employeeController.js";

router.post('/add', jwtAuthMiddleware, upload.single('image'), addEmployee ) 
router.get('/', jwtAuthMiddleware, getEmployee ) 
router.get('/:id', jwtAuthMiddleware, getEmployeeOne ) 
router.put('/:id', jwtAuthMiddleware, editEmployee ) 
router.get('/department/:id', jwtAuthMiddleware, fetchEmployeeByDepId ) 
export default router