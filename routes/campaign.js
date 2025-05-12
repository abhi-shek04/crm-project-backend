const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management
 */

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campaign created
 *       500:
 *         description: Server error
 */
router.post('/', auth, campaignController.createCampaign);

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns for the logged-in user
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of campaigns
 *       500:
 *         description: Server error
 */
router.get('/', auth, campaignController.getCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign found
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.get('/:id', auth, campaignController.getCampaignById);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Update a campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Campaign updated
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, campaignController.updateCampaign);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign by ID
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, campaignController.deleteCampaign);

/**
 * @swagger
 * /api/campaigns/{id}/deliver:
 *   post:
 *     summary: Deliver a campaign to its audience
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign delivered
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.post('/:id/deliver', auth, campaignController.deliverCampaign);

/**
 * @swagger
 * /api/campaigns/{id}/stats:
 *   get:
 *     summary: Get campaign stats and logs
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign stats and logs
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.get('/:id/stats', auth, campaignController.getCampaignStats);

/**
 * @swagger
 * /api/campaigns/analytics:
 *   get:
 *     summary: Get campaign analytics for the logged-in user
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Campaign analytics
 *       500:
 *         description: Server error
 */
router.get('/analytics', auth, campaignController.getAnalytics);

module.exports = router; 