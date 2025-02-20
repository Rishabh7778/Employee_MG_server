import Leave from "../models/leave.js";
import Employee from '../models/employeeModel.js'

const addLeave = async (req, res) => {

    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;
        const employee = await Employee.findOne({ userId })
        console.log("Leave");

        const newLeave = new Leave({
            employeeId: employee._id, leaveType, startDate, endDate, reason
        })
        await newLeave.save();
        return res.status(200).json({ success: true, message: "Leave Approved" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Leave add error in server" })

    }
};

const getLeave = async (req, res) => {
    try {
      const { id } = req.params;
      // First, try to find the employee.
      // Adjust this depending on whether id is an employee _id or a userId.
      let employee = await Employee.findById(id);
      if (!employee) {
        // If not found by _id, try finding by userId
        employee = await Employee.findOne({ userId: id });
      }
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found" });
      }
  
      // Now, fetch leaves for the found employee
      const leaves = await Leave.find({ employeeId: employee._id });
      // Always return success, even if leaves is an empty array
      return res.status(200).json({ success: true, leaves });
    } catch (error) {
      console.log("Error in getLeave:", error);
      return res.status(500).json({ success: false, error: "Leave get error in server" });
    }
  };
  


const getLeaves = async(req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        })
        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.log("Error in getLeave:", error);
        return res.status(500).json({ success: false, error: "Leave get error in server" });
    }
}

const getLeaveDetail = async(req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name, profileImage'
                }
            ]
        })
        return res.status(200).json({ success: true, leave });
    } catch (error) {
        console.log("Error in getLeave:", error);
        return res.status(500).json({ success: false, error: "Leave get error in server" });
    }
}

const updateLeave = async(req, res) => {
    try {
        const {id} = req.params;
        const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
        if(!leave){
            return res.status(404).json({success: false, error: "Id is not match"})
        }
        return res.status(200).json({success: true})
    } catch (error) {
        console.log("Error in getLeave:", error);
        return res.status(500).json({ success: false, error: "update Leave error in server" });
    }
}


export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };