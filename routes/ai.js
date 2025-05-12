/**
 * @swagger
 * /api/ai/segment-rule:
 *   post:
 *     summary: Parse a natural language segment rule prompt into a logical rule object
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: People who haven't shopped in 6 months and spent over 10K
 *     responses:
 *       200:
 *         description: Parsed rule object
 *       400:
 *         description: Prompt is required
 *       500:
 *         description: AI parsing error
 */
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/segment-rule', auth, aiController.parseSegmentRule);

module.exports = router; 