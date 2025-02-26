import Attendance from '../models/attendanceModel.js';
import Employee from '../models/employeeModel.js';

const getAttendance = async (req, res) => {
    try {
        // Corrected date initialization
        const date = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.find({ date }).populate({
            path: "employeeId",
            populate: ["department", "userId"]
        });

        res.status(200).json({ success: true, attendance });
    } catch (error) {
        res.status(200).json({ success: false, error: "Error Attendance controller in Server" });
    }
};


const updateAttendance = async(req, res) => {
    try {
        const {employeeId} = req.params;
        const { status } = req.body;
        const date = new Date().toISOString().split('T')[0]
        const employee = await Employee.findOne({employeeId})

        const attendance = await Attendance.findOneAndUpdate(
            { employeeId: employee._id, date },
            { status },
            { new: true }
          );
                  
        res.status(200).json({success: true, attendance})
    } catch (error) {
        console.log(error);
        res.status(200).json({success: false, error: "Update attendance error in server"})
    }
}


const attendanceReport = async(req, res) => {
    try {
        const {date, limit= 5, skip=0} = req.query;
        const query = {};

        if(date){
            query.date = date;
        }

        const attendanceData = await Attendance.find(query)
        .populate({
            path: "employeeId",
            populate: [
                "department",
                "userId"
            ]
        }).sort({date: -1}).limit(parseInt(limit)).skip(parseInt(skip))


        const groupData = attendanceData.reduce((result, record) => {
            if(!result[record.date]){
                result[record.date] = [];
            }
            result[record.date].push({
                employeeId: record.employeeId.employeeId,
                employeeName: record.employeeId.userId.name,
                departmentName: record.employeeId.department.dep_name,
                status: record.status || "Not Marked"
            });
            return result;
        }, {});        
        return res.status(200).json({success: true, groupData})
    } catch (error) {
        console.log(error);
        res.status(200).json({success: false, error: "attendancereport error in server"});
    }
}

export { getAttendance,updateAttendance, attendanceReport };
