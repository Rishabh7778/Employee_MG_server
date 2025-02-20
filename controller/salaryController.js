import Salary from "../models/salaryModel.js";
import Employee from "../models/employeeModel.js";

const addSalary = async (req, res) => {
    try {
        const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;
        const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions)
        const newSalary = new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary: totalSalary,
            payDate
        })

        await newSalary.save();
        return res.status(200).json({ success: true, message: "salary is maked" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: "Add Salary error in server" })

    }
}

const getSalary = async (req, res) => {
    try {
      const { id } = req.params;
      // पहले employeeId के आधार पर सैलेरी खोजें
      let salary = await Salary.find({ employeeId: id }).populate('employeeId', 'employeeId');
      
      // अगर कोई रिकॉर्ड नहीं मिलता
      if (!salary || salary.length < 1) {
        // मान लीजिए id userId भी हो सकता है, पहले कर्मचारी ढूंढें
        const employee = await Employee.findOne({ userId: id });
        if (!employee) {
          // कर्मचारी नहीं मिला, इसलिए खाली array रिटर्न करें (या उपयुक्त संदेश भी दे सकते हैं)
          return res.status(200).json({ success: true, salary: [] });
        }
        salary = await Salary.find({ employeeId: employee._id }).populate('employeeId', 'employeeId');
      }
      
      return res.status(200).json({ success: true, salary });
    } catch (error) {
      console.log("Error in getSalary:", error);
      return res.status(500).json({ success: false, error: "get Salary error in server" });
    }
  };
  

export { addSalary, getSalary }