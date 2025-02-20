import multer from "multer";
import Employee from "../models/employeeModel.js";
import User from "../models/user.js"
import bcrypt from 'bcrypt';
import path from "path";
import DepartmentModel from "../models/departmentModel.js";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({ storage: storage })

const addEmployee = async (req, res) => {
    try {
        const { name, email, employeeId, password, dob, gender, maritalStatus, designation, department, salary, role } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            res.status(404).json({ success: false, error: "User already exist in Employees list" })
        }
        const hashpassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashpassword,
            role,
            profileImage: req.file ? req.file.filename : ""
        })

        const savedUser = await newUser.save()

        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            role
        })

        await newEmployee.save()

        return res.status(200).json({ success: true, message: "Employee is created" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: "server error in adding employee" })

    }

}


const getEmployee = async (req, res) => {
    try {

        const employees = await Employee.find().populate('userId', { password: 0 }).populate('department');
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error in Get employees Controller" });
    }
}


const getEmployeeOne = async (req, res) => {
    const { id } = req.params;
    try {
        let employees;
        employees = await Employee.findById(id).populate('userId', { password: 0 }).populate('department');
        if (!employees) {
            employees = await Employee.findOne({ userId: id }).populate('userId', { password: 0 }).populate('department');
        }
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: "Server Error in Get employees One Controller" });
    }
}

const editEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, department, maritalStatus, salary } = req.body;

        console.log('Fetching employee with ID:', id); // Add log to check the ID
        const employee = await Employee.findById({ _id: id });
        if (!employee) {
            console.log('Employee not found'); // Add log for missing employee
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        const user = await User.findById({ _id: employee.userId });
        if (!user) {
            console.log('User not found for employee:', employee.userId); // Add log for missing user
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const updateUser = await User.findByIdAndUpdate({ _id: employee.userId }, { name });
        const updateEmployee = await Employee.findByIdAndUpdate({ _id: id }, {
            maritalStatus,
            designation,
            salary,
            department
        });

        if (!updateUser || !updateEmployee) {
            console.log('Failed to update user or employee'); // Add log for failed update
            return res.status(404).json({ success: false, error: "Document is not found" });
        }

        return res.status(200).json({ success: true, message: "Employee is successfully updated" });

    } catch (error) {
        console.error('Error in editing employee:', error); // Detailed error log
        return res.status(500).json({ success: false, error: "Server Error in Edit employees Controller" });
    }
};


const fetchEmployeeByDepId = async (req, res) => {
    try {
        const { id } = req.params; // Add this line to get the ID from request params
        const employees = await Employee.find({ department: id })
        return res.status(200).json({ success: true, employees });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Server Error in Get employeeByDepId Controller"
        });
    }
}

export { addEmployee, upload, getEmployee, getEmployeeOne, editEmployee, fetchEmployeeByDepId }