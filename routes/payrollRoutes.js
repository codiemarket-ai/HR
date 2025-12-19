const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware'); // استيراد الحماية
const { calculateMonthlyPayroll, deletePayroll, getPayrollSlips } = require('../controllers/payrollController');

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
 *     summary: تشغيل محرك حساب الرواتب لشهر معين (HR/Finance)
 *     tags: [Payroll]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - month
 *               - year
 *             properties:
 *               employeeId:
 *                 type: string
 *               month:
 *                 type: number
 *               year:
 *                 type: number
 *               bonus:
 *                 type: number
 *                 description: مكافأة إضافية (اختياري)
 *               overtime:
 *                 type: number
 *                 description: قيمة العمل الإضافي (اختياري)
 *     responses:
 *       200:
 *         description: تم حساب الراتب بنجاح
 */
router.post('/calculate', authorize(['Admin', 'HR', 'Finance']), calculateMonthlyPayroll);

/**
 * @swagger
 * /api/payroll:
 *   get:
 *     summary: عرض سجلات الرواتب
 *     tags: [Payroll]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: قائمة الرواتب
 */
router.get('/', authorize(['Admin', 'HR', 'Finance', 'Manager']), getPayrollSlips);

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
 *     responses:
 *       200:
 *         description: تم حذف سجل الراتب بنجاح
 */
router.delete('/:id', authorize(['Admin', 'Manager']), deletePayroll);


module.exports = router;