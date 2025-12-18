const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware'); // استيراد الحماية
const { calculateMonthlyPayroll, deletePayroll } = require('../controllers/payrollController');

/**
 * @swagger
 * tags:
 *   name: Payroll
 *   description: إدارة الرواتب
 */

/**
 * @swagger
 * /api/payroll/calculate:
 *   post:
 *     summary: تشغيل محرك حساب الرواتب لشهر معين
 *     tags: [Payroll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *               gezaDays:
 *                 type: number
 *                 description: عدد أيام الجزاء
 *               salfahDeduction:
 *                 type: number
 *                 description: قسط السلفة
 *     responses:
 *       200:
 *         description: تم حساب الراتب بنجاح
 */
router.post('/calculate', calculateMonthlyPayroll);

/**
 * @swagger
 * /api/payroll/{id}:
 *   delete:
 *     summary: حذف سجل راتب (للمديرين فقط)
 *     tags: [Payroll]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف سجل الراتب
 *       - in: header
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Manager]
 *         description: يجب أن تكون القيمة Manager
 *     responses:
 *       200:
 *         description: تم حذف سجل الراتب بنجاح
 *       403:
 *         description: ليس لديك صلاحية
 *       404:
 *         description: سجل الراتب غير موجود
 *       500:
 *         description: خطأ في الخادم
 */
router.delete('/:id', authorize(['Manager']), deletePayroll);


module.exports = router;