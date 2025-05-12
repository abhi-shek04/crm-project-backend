const express = require('express');
const router = express.Router();
const logController = require('../controllers/communicationLogController');
const auth = require('../middleware/auth');

// All routes are protected
router.post('/', auth, logController.createLog);
router.get('/', auth, logController.getLogs);
router.get('/campaign/:campaignId', auth, logController.getLogsByCampaign);
router.get('/customer/:customerId', auth, logController.getLogsByCustomer);
router.put('/:id/status', auth, logController.updateLogStatus);

module.exports = router; 