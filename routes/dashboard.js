import express from 'express';
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { getSummary } from '../controller/dashboardController.js';
const router = express.Router();


router.get('/summary', jwtAuthMiddleware, getSummary);


export default router
