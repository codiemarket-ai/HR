const express = require('express');
const router = express.Router();
const { createTask, completeTask, deleteTask } = require('../controllers/taskController');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: إدارة المهام
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: تعيين مهمة جديدة
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - assignedTo
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               weight:
 *                 type: number
 *     responses:
 *       201:
 *         description: Task Created
 */
router.post('/', createTask);

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   patch:
 *     summary: إغلاق المهمة ورفع الإثبات
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proofFileURL:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تحديث الحالة
 */
router.patch('/:id/complete', completeTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: حذف مهمة
 *     tags: [Tasks]
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
router.delete('/:id', deleteTask);


module.exports = router;