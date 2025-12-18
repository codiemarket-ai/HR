const mongoose = require('mongoose');

const PerformanceReviewSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    period: {
        month: { type: Number, required: true },
        year: { type: Number, required: true }
    },
    // الجزء الأول: الأداء المعتمد على المهام (تلقائي)
    taskPerformance: {
        completedTasksCount: { type: Number, default: 0 },
        averageTaskWeight: { type: Number, default: 0 },
        taskScore: { type: Number, min: 0, max: 100, default: 0 } // يحسب برمجياً
    },
    // الجزء الثاني: التقييم الإداري (يدوي)
    managerScore: { type: Number, min: 0, max: 100 },
    hrScore: { type: Number, min: 0, max: 100 },
    
    // النتيجة النهائية المدمجة
    overallScore: { type: Number, min: 0, max: 100 }, 
    
    kpiBreakdown: [{
        kpiId: { type: mongoose.Schema.Types.ObjectId },
        score: { type: Number }
    }],
    status: { type: String, enum: ['Draft', 'Calculated', 'Finalized'], default: 'Draft' },
    employeeAcknowledged: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PerformanceReview', PerformanceReviewSchema);