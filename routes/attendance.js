import express from 'express';
import { jwtAuthMiddleware } from "../middleware/jwt.js";
import { attendanceReport, getAttendance, updateAttendance } from '../controller/attendanceController.js';
import  defaultAttendance from '../middleware/defaultAttendance.js'
const router = express.Router();


router.get('/', jwtAuthMiddleware, defaultAttendance, getAttendance)
router.put('/update/:employeeId', jwtAuthMiddleware, updateAttendance) 
router.get('/report', jwtAuthMiddleware, attendanceReport) 

export default router;
