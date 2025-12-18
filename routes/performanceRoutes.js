const express = require('express');
const router = express.Router();
const {
  getAutoPerformance,
  submitReview, deletePerformance
} = require('../controllers/performanceController');

/**
 * @swagger
 * tags:
 *   - name: Performance
 *     description: نظام تقييم الأداء المزدوج (تلقائي + يدوي)
 */

/**
 * @swagger
 * /api/performance/auto-score:
 *   get:
 *     summary: عرض الأداء التلقائي المحسوب من المهام
 *     tags: [Performance]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف الموظف
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: رقم الشهر
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: السنة
 *     responses:
 *       200:
 *         description: تم حساب الأداء التلقائي بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employeeId:
 *                   type: string
 *                 month:
 *                   type: integer
 *                 year:
 *                   type: integer
 *                 autoScore:
 *                   type: number
 *                   description: الدرجة التلقائية المحسوبة
 *       400:
 *         description: بيانات غير صحيحة
 *       500:
 *         description: خطأ في الخادم
 */
router.get('/auto-score', getAutoPerformance);

/**
 * @swagger
 * /api/performance/submit-review:
 *   post:
 *     summary: إرسال تقييم المدير أو قسم الموارد البشرية
 *     tags: [Performance]
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
 *               - score
 *               - reviewerRole
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: معرف الموظف
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: الدرجة من 0 إلى 100
 *               reviewerRole:
 *                 type: string
 *                 enum: [Manager, HR]
 *                 description: دور المراجع
 *               comment:
 *                 type: string
 *                 description: ملاحظات اختيارية
 *     responses:
 *       200:
 *         description: تم حفظ التقييم بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: بيانات غير صحيحة
 *       500:
 *         description: خطأ في الخادم
 */
router.post('/submit-review', submitReview);

/**
 * @swagger
 * /api/performance/{id}:
 *   delete:
 *     summary: حذف تقييم الأداء
 *     tags: [Performance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: معرف المهمة
 *     responses:
 *       200:
 *         description: تم حذف المهمة بنجاح
 *       404:
 *         description: المهمة غير موجودة
 *       500:
 *         description: خطأ في الخادم
 */
router.delete('/:id', deletePerformance);


module.exports = router;
