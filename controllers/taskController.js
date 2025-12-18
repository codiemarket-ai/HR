const Task = require('../models/Task');

// إضافة مهمة جديدة
exports.createTask = async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// إتمام مهمة وتحديث البيانات
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            { 
                status: 'Completed', 
                completedAt: Date.now(),
                proofFileURL: req.body.proofFileURL 
            }, 
            { new: true }
        );
        res.status(200).json({ success: true, message: "Task finalized for scoring", data: task });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// دالة عامة يمكنك تطبيقها في كل متحكم مع تغيير الموديل
exports.deleteTask = (Model, name) => async (req, res) => {
    try {
        const record = await Model.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: `هذا الـ ${name} غير موجود` });
        res.status(200).json({ success: true, message: `تم حذف الـ ${name} بنجاح` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};