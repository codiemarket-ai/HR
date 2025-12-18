const Employee = require('../models/employees');

exports.addEmployee = async (req, res) => {
    try {
        // يتم حساب الراتب التأميني تلقائياً داخل الـ Schema
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEmployeeProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('departmentId');
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(404).json({ message: "الموظف غير موجود" });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        // التحقق مما إذا كان للموظف سلف نشطة قبل الحذف
        const hasActiveSalfah = await Salfah.findOne({ employeeId: req.params.id, status: 'Active' });
        if (hasActiveSalfah) return res.status(400).json({ message: "لا يمكن حذف موظف لديه سلفة نشطة" });

        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "تم حذف الموظف وجميع بياناته" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};