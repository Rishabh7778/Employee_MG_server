import mongoose from 'mongoose';


const AttendanceSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },
        employeeId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Sick", "Leave"],
            default: null
        }
    }
)

const Attendance = mongoose.model("Attandance", AttendanceSchema)
export default Attendance;