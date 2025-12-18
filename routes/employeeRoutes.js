const express = require('express');
const router = express.Router();
const { addEmployee, getEmployeeProfile, deleteEmployee } = require('../controllers/employeeController');
const { authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: إدارة بيانات الموظفين والرواتب الأساسية
 */


/**
 * @swagger
 * /api/employees/add:
 *   post:
 *     summary: إضافة موظف جديد (HR أو Manager فقط)
 *     tags: [Employees]
 *     parameters:
 *       - in: header
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [HR, Manager]
 *         description: يجب أن تكون القيمة HR أو Manager
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: تم إنشاء الموظف بنجاح
 *       403:
 *         description: غير مسموح لهذه الصلاحية
 *       400:
 *         description: بيانات غير صحيحة
 *       500:
 *         description: خطأ في الخادم
 */
// هنا قمنا بتحديد أن الـ HR والـ Manager فقط هم من يملكون صلاحية الـ POST
router.post('/add', authorize(['HR', 'Manager']), addEmployee);


/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: الحصول على بيانات موظف محدد
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: معرف الموظف (MongoDB ID)
 *     responses:
 *       200:
 *         description: تم جلب البيانات بنجاح
 */
router.get('/:id', getEmployeeProfile);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: حذف موظف نهائياً
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الموظف
 *     responses:
 *       200:
 *         description: تم حذف الموظف بنجاح
 *       404:
 *         description: الموظف غير موجود
 *       500:
 *         description: خطأ في الخادم
 */
router.delete('/:id', deleteEmployee);


module.exports = router;