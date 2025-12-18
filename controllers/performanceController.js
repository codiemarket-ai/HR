const PerformanceReview = require('../models/PerformanceReview');
const Task = require('../models/Task');

// 1. الحصول على الأداء التلقائي (للمدير والـ HR قبل التقييم)
exports.getAutoPerformance = async (req, res) => {
    try {
        const { employeeId, month, year } = req.query;

        // حساب نقاط المهام المنجزة في هذه الفترة
        const tasks = await Task.find({ 
            assignedTo: employeeId, 
            status: 'Completed' 
            // يمكن إضافة فلترة بالتاريخ هنا
        });

        let taskPoints = 0;
        if (tasks.length > 0) {
            const totalWeight = tasks.reduce((acc, t) => acc + t.weight, 0);
            taskPoints = Math.min((totalWeight / 10) * 100, 100); 
        }

        res.status(200).json({
            success: true,
            data: {
                employeeId,
                month,
                year,
                autoTaskScore: taskPoints,
                completedTasksCount: tasks.length,
                message: "هذا التقييم محسوب تلقائياً من واقع المهام المنجزة"
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. إرسال مراجعة المدير أو الـ HR
exports.submitReview = async (req, res) => {
    try {
        const { employeeId, month, year, score, reviewerRole, comment } = req.body;
        
        // التحقق من الدور (Manager أو HR)
        const updateField = reviewerRole === 'Manager' ? { managerScore: score } : { hrScore: score };
        
        const review = await PerformanceReview.findOneAndUpdate(
            { employeeId, 'period.month': month, 'period.year': year },
            { 
                ...updateField,
                $set: { status: 'Calculated' } 
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: `تم تسجيل تقييم ${reviewerRole} بنجاح`,
            data: review
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// دالة عامة يمكنك تطبيقها في كل متحكم مع تغيير الموديل
exports.deletePerformance = (Model, name) => async (req, res) => {
    try {
        const record = await Model.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: `هذا الـ ${name} غير موجود` });
        res.status(200).json({ success: true, message: `تم حذف الـ ${name} بنجاح` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};