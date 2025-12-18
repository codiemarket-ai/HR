const Employee = require('../models/employees');
const PayrollSlip = require('../models/PayrollSlip');

exports.calculateMonthlyPayroll = async (req, res) => {
    try {
        const { employeeId, month, year, bonus, overtime, gezaDays, salfahDeduction } = req.body;
        const employee = await Employee.findById(employeeId);

        if (!employee) return res.status(404).json({ message: "الموظف غير موجود" });

        const basic = parseFloat(employee.financials.basicSalary);
        const gross = basic + (bonus || 0) + (overtime || 0);

        // 1. التأمينات الاجتماعية (11% من الراتب التأميني)
        const insSalary = parseFloat(employee.financials.insuranceSalary);
        const socialInsurance = insSalary * 0.11;

        // 2. ضريبة كسب العمل (تبسيط للمعادلة السنوية لقانون 175)
        // ملاحظة: في النسخة الإنتاجية يتم حساب الشرائح تصاعدياً
        const annualTaxable = (gross - socialInsurance - 20000) * 12; // خصم الإعفاء الشخصي
        const annualTax = annualTaxable > 0 ? annualTaxable * 0.10 : 0; // مثال لشريحة الـ 10%
        const monthlyTax = annualTax / 12;

        // 3. صندوق الشهداء (0.05% من إجمالي الراتب)
        const martyrsFund = gross * 0.0005;

        // 4. خصم الجزاء (أيام الخصم بناءً على الراتب الأساسي)
        const gezaAmount = (basic / 30) * (gezaDays || 0);

        // 5. صافي الراتب النهائي
        const totalDeductions = socialInsurance + monthlyTax + martyrsFund + (salfahDeduction || 0) + gezaAmount;
        const netSalary = gross - totalDeductions;

        // التحقق من حد الـ 50% للقانون المصري
        const isCapped = totalDeductions > (gross * 0.5);

        const slip = await PayrollSlip.create({
            employeeId,
            period: { month, year },
            earnings: { basic, bonus, gross },
            deductions: { socialInsurance, incomeTax: monthlyTax, martyrsFund, salfah: salfahDeduction, geza: gezaAmount },
            netSalary,
            isCapped
        });

        res.status(201).json({ success: true, data: slip });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// دالة عامة يمكنك تطبيقها في كل متحكم مع تغيير الموديل
exports.deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        
        const record = await PayrollSlip.findByIdAndDelete(id);
        
        if (!record) {
            return res.status(404).json({ success: false, message: "سجل الراتب هذا غير موجود" });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "تم حذف سجل الراتب بنجاح بواسطة المدير" 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};