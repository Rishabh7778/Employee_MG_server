import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Employee from "../models/employeeModel.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

// Configure Cloudinary using environment variables (make sure these are set in your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

// Use Multer's memoryStorage so that the file is stored in memory (not on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controller to add a new employee with Cloudinary upload
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      password,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      role
    } = req.body;

    // Validate required fields (optional)
    if (!name || !email || !employeeId || !password || !dob || !gender || !maritalStatus || !designation || !department || !salary || !role) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User already exist in Employees list" });
    }

    // Hash the password
    const hashpassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary if a file is provided
    let profileImage = "";
    if (req.file) {
      try {
        const cloudResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "employee_images" }, // Optional folder name
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
        profileImage = cloudResult.secure_url; // This is the public URL from Cloudinary
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ success: false, error: "Cloudinary upload error" });
      }
    }

    // Create new user with the Cloudinary image URL
    const newUser = new User({
      name,
      email,
      password: hashpassword,
      role,
      profileImage, // Save the Cloudinary URL here
    });
    const savedUser = await newUser.save();

    // Create new employee referencing the saved user
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      role,
    });
    await newEmployee.save();

    return res.status(200).json({ success: true, message: "Employee is created" });
  } catch (error) {
    console.error("Error in addEmployee controller:", error);
    return res.status(500).json({ success: false, error: "Server error in adding employee" });
  }
};

// Other controllers remain unchanged

const getEmployee = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error in Get employees Controller" });
  }
};

const getEmployeeOne = async (req, res) => {
  const { id } = req.params;
  try {
    let employees = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employees) {
      employees = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error in Get employees One Controller" });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, maritalStatus, salary } = req.body;

    console.log('Fetching employee with ID:', id);
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      console.log('Employee not found');
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      console.log('User not found for employee:', employee.userId);
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
      console.log('Failed to update user or employee');
      return res.status(404).json({ success: false, error: "Document is not found" });
    }

    return res.status(200).json({ success: true, message: "Employee is successfully updated" });

  } catch (error) {
    console.error('Error in editing employee:', error);
    return res.status(500).json({ success: false, error: "Server Error in Edit employees Controller" });
  }
};

const fetchEmployeeByDepId = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server Error in Get employeeByDepId Controller"
    });
  }
};

export { addEmployee, upload, getEmployee, getEmployeeOne, editEmployee, fetchEmployeeByDepId };
