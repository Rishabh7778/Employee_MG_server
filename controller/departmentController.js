import DepartmentModel from "../models/departmentModel.js";

const addDepartment = async (req, res) => {
    try {
        const { dep_name, description } = req.body;
        const newDept = new DepartmentModel({ dep_name, description });
        await newDept.save();
        return res.status(200).json({ success: true, department: newDept });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error in Add Department Controller" });
    }
}

const getDepartments = async (req, res) => {
    try {
        const departments = await DepartmentModel.find();
        return res.status(200).json({ success: true, departments });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error in Get Department Controller" });
    }
}

const getEditDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await DepartmentModel.findById(id);
        return res.status(200).json({ success: true, department });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error in GetEdit Department Controller" });
    }
}

const UpdateEditDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { dep_name, description } = req.body;
        const updateDep = await DepartmentModel.findByIdAndUpdate(
            id,
            { dep_name, description },
            { new: true } // returns the updated document
        );
        if (!updateDep) {
            return res.status(404).json({ success: false, error: "Department not found" });
        }
        return res.status(200).json({ success: true, department: updateDep });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server Error in UpdateEdit Department Controller" });
    }
}

const deleteDepartment = async (req, res) => {
    try {
      const { id } = req.params;
      const deleteDep = await DepartmentModel.findById({_id: id});
      await deleteDep.deleteOne();
      if (!deleteDep) {
        return res.status(404).json({ success: false, error: "Department not found" });
      }
      return res.status(200).json({ success: true, department: deleteDep });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Server Error in Delete Department Controller" });
    }
  };


export { addDepartment, getDepartments, getEditDepartment, UpdateEditDepartment, deleteDepartment };
