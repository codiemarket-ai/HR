const express = require('express');
const router = express.Router();
const { requestSalfah, reviewSalfah, deleteRecord, deleteSalfah } = require('../controllers/salfahController');

/**
 * @swagger
 * tags:
 *   name: Salfah
 *   description: إدارة السلف
 */

/**
 * @swagger
 * /api/salfah/request:
 *   post:
 *     summary: تقديم طلب سلفة جديد
 *     tags: [Salfah]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *               installments:
 *                 type: number
 *                 description: عدد الشهور
 *     responses:
 *       200:
 *         description: تم تقديم طلب السلفة بنجاح
 */
router.post('/request', requestSalfah);

/**
 * @swagger
 * /api/salfah/review:
 *   post:
 *     summary: اعتماد أو رفض طلب السلفة (للـ HR والمديرين)
 *     tags: [Salfah]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salfahId
 *               - decision
 *               - reviewerId
 *             properties:
 *               salfahId:
 *                 type: string
 *                 description: معرف طلب السلفة
 *               decision:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *                 description: قرار المراجعة
 *               reviewerId:
 *                 type: string
 *                 description: معرف الشخص الذي اتخذ القرار
 *               rejectionReason:
 *                 type: string
 *                 description: سبب الرفض (مطلوب عند اختيار Rejected)
 *     responses:
 *       200:
 *         description: تم تحديث حالة طلب السلفة بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: بيانات غير صحيحة
 *       404:
 *         description: طلب السلفة غير موجود
 *       500:
 *         description: خطأ في الخادم
 */
router.post('/review', reviewSalfah);

/**
 * @swagger
 * /api/salfah/{id}:
 *   delete:
 *     summary: حذف طلب سلفة
 *     tags: [Salfah]
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
router.delete('/:id', deleteSalfah);


module.exports = router;