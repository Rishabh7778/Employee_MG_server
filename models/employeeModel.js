import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: [true, "Name is required"],
        },
        employeeId: {
            type: String,
            required: [true, "Id is required"],
            unique: true
        },
        dob: {
            type: Date
        },
        gender: {
            type: String
        },        
        maritalStatus: {
            type: String
        },
        designation: {
            type: String
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: [true, "Department is required"],
        },
        salary: {
            type: Number,
            required: [true, "Salary is required"],
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
    }
);


const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
