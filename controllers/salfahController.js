const Salfah = require('../models/Salfah');

// 1. طلب سلفة جديد (تكون حالتها Pending تلقائياً)
exports.requestSalfah = async (req, res) => {
    try {
        const { employeeId, totalAmount, installments, reason } = req.body;
        
        const monthlyInstallment = totalAmount / installments;

        const salfah = await Salfah.create({
            employeeId,
            totalAmount,
            remainingAmount: totalAmount,
            monthlyInstallment,
            reason,
            status: 'Pending'
        });

        res.status(201).json({ success: true, message: "طلب السلفة قيد الانتظار لموافقة الإدارة", data: salfah });
    } catch (error) {
        res.status(400).json({ success: false, error: "يوجد طلب سلفة بالفعل قيد المعالجة لهذا الموظف" });
    }
};

// 2. الموافقة أو الرفض (من قبل المدير أو HR)
exports.reviewSalfah = async (req, res) => {
    try {
        const { salfahId, decision, rejectionReason, reviewerId } = req.body; // decision: 'Approved' or 'Rejected'

        const status = decision === 'Approved' ? 'Active' : 'Rejected';
        const updateData = {
            status: status,
            approvedBy: reviewerId,
            approvalDate: Date.now()
        };

        if (decision === 'Approved') {
            updateData.startDate = Date.now();
        } else {
            updateData.rejectionReason = rejectionReason;
        }

        const salfah = await Salfah.findByIdAndUpdate(salfahId, updateData, { new: true });

        res.status(200).json({ 
            success: true, 
            message: decision === 'Approved' ? "تمت الموافقة وتفعيل السلفة" : "تم رفض الطلب",
            data: salfah 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// دالة عامة يمكنك تطبيقها في كل متحكم مع تغيير الموديل
exports.deleteSalfah = (Model, name) => async (req, res) => {
    try {
        const record = await Model.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ message: `هذا الـ ${name} غير موجود` });
        res.status(200).json({ success: true, message: `تم حذف الـ ${name} بنجاح` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};