const mongoose = require('mongoose');

const PayrollSlipSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    period: {
        month: { type: Number, required: true },
        year: { type: Number, required: true }
    },
    earnings: {
        basic: mongoose.Types.Decimal128,
        overtime: { type: mongoose.Types.Decimal128, default: 0 },
        bonus: { type: mongoose.Types.Decimal128, default: 0 },
        gross: mongoose.Types.Decimal128
    },
    deductions: {
        socialInsurance: mongoose.Types.Decimal128, // 11% of InsuranceSalary
        incomeTax: mongoose.Types.Decimal128,       // Based on Law 175/2023
        martyrsFund: mongoose.Types.Decimal128,     // 0.05% of Gross
        salfah: { type: mongoose.Types.Decimal128, default: 0 },
        geza: { type: mongoose.Types.Decimal128, default: 0 }
    },
    netSalary: mongoose.Types.Decimal128,
    isCapped: { type: Boolean, default: false }, // True if 50% cap was triggered
    status: { type: String, enum: ["Draft", "Approved", "Paid"], default: "Draft" }
}, { timestamps: true });

module.exports = mongoose.model('PayrollSlip', PayrollSlipSchema);