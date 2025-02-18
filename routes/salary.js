import express from "express";
const router = express.Router();
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { addSalary, getSalary } from "../controller/salaryController.js";

router.post('/add', jwtAuthMiddleware, addSalary ) 
router.get('/:id', jwtAuthMiddleware, getSalary ) 


export default router