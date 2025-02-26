import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js'; 
import authRouter from './routes/auth.js';
import departmentRoute from './routes/department.js'
import employeeRoute from './routes/employee.js'
import salaryRoute from './routes/salary.js'
import leaveRoute from './routes/leave.js'
import settingRoute from './routes/setting.js'
import dashboardRoute from './routes/dashboard.js'
import attendanceRoute from './routes/attendance.js'

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads'));
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/salary', salaryRoute);
app.use('/api/leave', leaveRoute);
app.use('/api/setting', settingRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/attendance', attendanceRoute);


connectDB();

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
