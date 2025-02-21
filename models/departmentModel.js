import mongoose from "mongoose";
import Employee from "./employeeModel.js";
import Leave from "./leave.js";
import Salary from "./salaryModel.js"

const deptSchema = new mongoose.Schema({
    dep_name:{
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})



deptSchema.pre("deleteOne", {document: true, query: false}, async function(next){
    try {
        const employees = await Employee.find({department: this._id})
        const empIds = employees.map(emp => emp._id);
        await Employee.deleteMany({department: this._id})
        await Leave.deleteMany({employeeId: {$in: empIds}})
        await Salary.deleteMany({employeeId: {$in: empIds}})
    } catch (error) {
        next(error)
    }
})


const DepartmentModel = mongoose.model("Department", deptSchema)
export default DepartmentModel;