import mongoose from "mongoose";

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


const DepartmentModel = mongoose.model("Department", deptSchema)
export default DepartmentModel;