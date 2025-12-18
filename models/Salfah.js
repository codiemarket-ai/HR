const mongoose = require('mongoose');

const SalfahSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    totalAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    monthlyInstallment: { type: Number, required: true },
    startDate: { type: Date }, // لا يُحدد إلا بعد الموافقة
    // تحديث الحالات لتشمل دورة الموافقة
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Settled', 'Cancelled'], 
        default: 'Pending' 
    },
    reason: { type: String }, // سبب طلب السلفة من الموظف
    rejectionReason: { type: String }, // سبب الرفض من قبل الإدارة
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // المدير أو الـ HR الذي وافق
    approvalDate: { type: Date }
}, { timestamps: true });

// تعديل الـ Index لضمان عدم وجود أكثر من طلب "نشط" أو "قيد الانتظار" في نفس الوقت
SalfahSchema.index({ employeeId: 1, status: 1 }, { 
    unique: true, 
    partialFilterExpression: { status: { $in: ['Pending', 'Active', 'Approved'] } } 
});

module.exports = mongoose.model('Salfah', SalfahSchema);