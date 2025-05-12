const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Validation middleware
const segmentValidation = [
  check('name').notEmpty().withMessage('Segment name is required'),
  check('rules').isArray().withMessage('Rules must be an array'),
  check('rules.*.field').notEmpty().withMessage('Rule field is required'),
  check('rules.*.operator').isIn(['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'between'])
    .withMessage('Invalid operator'),
  check('rules.*.value').notEmpty().withMessage('Rule value is required')
];

// All routes are protected
router.use(auth);

// CRUD operations
router.post('/', segmentValidation, segmentController.createSegment);
router.get('/', segmentController.getSegments);
router.get('/:id', segmentController.getSegmentById);
router.put('/:id', segmentValidation, segmentController.updateSegment);
router.delete('/:id', segmentController.deleteSegment);

// Customer management
router.get('/:id/customers', segmentController.getSegmentCustomers);
router.post('/:segmentId/customers/:customerId', segmentController.addCustomerToSegment);
router.delete('/:segmentId/customers/:customerId', segmentController.removeCustomerFromSegment);

// Segment evaluation
router.post('/:id/evaluate', segmentController.evaluateSegment);

module.exports = router; 