import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModel.js";

const defaultAttendance = async (req, res, next) => {
    try {
        // Get the date in local time zone
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const date = `${year}-${month}-${day}`;

        const existingAttendance = await Attendance.findOne({ date });

        if (!existingAttendance) {
            // Fetch all employees
            const employees = await Employee.find({});
            // Create attendance records for each employee
            const attendanceRecords = employees.map(employee => ({
                date,
                employeeId: employee._id,
                status: null
            }));
            // Insert attendance records
            await Attendance.insertMany(attendanceRecords);
        }
        // Proceed to the next middleware
        next();
    } catch (error) {
        console.log(error);
        // Pass the error to the next middleware
        next(error);
    }
};

export default defaultAttendance;