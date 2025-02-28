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

const updateAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Find the employee by employeeId field
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Update attendance record by matching employee reference and date
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId: employee._id, date: today },
      { status },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ success: false, error: "Attendance record not found" });
    }
              
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Update Attendance Error:", error);
    res.status(500).json({ success: false, error: "Update attendance error in server" });
  }
};

const attendanceReport = async (req, res) => {
  try {
    const { date, limit = 5, skip = 0 } = req.query;
    const query = {};

    if (date) {
      query.date = date;
    }

    const attendanceData = await Attendance.find(query)
      .populate({
        path: "employeeId",
        populate: ["department", "userId"]
      })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const groupData = attendanceData.reduce((result, record) => {
      // Skip records without valid employee data
      if (!record.employeeId) return result;

      const recordDate = record.date;
      if (!result[recordDate]) {
        result[recordDate] = [];
      }
      result[recordDate].push({
        employeeId: record.employeeId?.employeeId || "N/A",
        employeeName: record.employeeId?.userId?.name || "N/A",
        departmentName: record.employeeId?.department?.dep_name || "N/A",
        status: record.status || "Not Marked"
      });
      return result;
    }, {});

    res.status(200).json({ success: true, groupData });
  } catch (error) {
    console.error("Attendance Report Error:", error);
    res.status(500).json({ success: false, error: "Attendance report error in server" });
  }
};

export { getAttendance, updateAttendance, attendanceReport };
