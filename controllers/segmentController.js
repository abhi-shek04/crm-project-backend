const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const { validationResult } = require('express-validator');

// Create a new segment
exports.createSegment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const segment = new Segment({
      ...req.body,
      createdBy: req.user.id
    });

    await segment.save();
    res.status(201).json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating segment', error: error.message });
  }
};

// Get all segments
exports.getSegments = async (req, res) => {
  try {
    const segments = await Segment.find()
      .populate('createdBy', 'name email')
      .populate('modifiedBy', 'name email');
    res.json(segments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching segments', error: error.message });
  }
};

// Get segment by ID
exports.getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('modifiedBy', 'name email');
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    res.json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching segment', error: error.message });
  }
};

// Update segment
exports.updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    // Update segment fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') { // Don't allow changing creator
        segment[key] = req.body[key];
      }
    });

    segment.modifiedBy = req.user.id;
    await segment.save();
    
    res.json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating segment', error: error.message });
  }
};

// Delete segment
exports.deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    // Remove segment from all customers
    await Customer.updateMany(
      { segments: segment._id },
      { $pull: { segments: segment._id } }
    );

    await segment.remove();
    res.json({ message: 'Segment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting segment', error: error.message });
  }
};

// Get customers in segment
exports.getSegmentCustomers = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    const customers = await Customer.find({ segments: segment._id });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching segment customers', error: error.message });
  }
};

// Add customer to segment
exports.addCustomerToSegment = async (req, res) => {
  try {
    const { segmentId, customerId } = req.params;
    
    const [segment, customer] = await Promise.all([
      Segment.findById(segmentId),
      Customer.findById(customerId)
    ]);

    if (!segment || !customer) {
      return res.status(404).json({ message: 'Segment or customer not found' });
    }

    await customer.addSegment(segmentId);
    await segment.updateMetrics(await Customer.countDocuments({ segments: segmentId }));

    res.json({ message: 'Customer added to segment successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer to segment', error: error.message });
  }
};

// Remove customer from segment
exports.removeCustomerFromSegment = async (req, res) => {
  try {
    const { segmentId, customerId } = req.params;
    
    const [segment, customer] = await Promise.all([
      Segment.findById(segmentId),
      Customer.findById(customerId)
    ]);

    if (!segment || !customer) {
      return res.status(404).json({ message: 'Segment or customer not found' });
    }

    await customer.removeSegment(segmentId);
    await segment.updateMetrics(await Customer.countDocuments({ segments: segmentId }));

    res.json({ message: 'Customer removed from segment successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing customer from segment', error: error.message });
  }
};

// Evaluate segment rules for all customers
exports.evaluateSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }

    const customers = await Customer.find();
    const matchingCustomers = customers.filter(customer => segment.evaluateCustomer(customer));

    // Update segment with matching customers
    await Customer.updateMany(
      { _id: { $in: matchingCustomers.map(c => c._id) } },
      { $addToSet: { segments: segment._id } }
    );

    // Remove segment from non-matching customers
    await Customer.updateMany(
      { _id: { $nin: matchingCustomers.map(c => c._id) } },
      { $pull: { segments: segment._id } }
    );

    await segment.updateMetrics(matchingCustomers.length);

    res.json({
      message: 'Segment evaluation completed',
      matchingCustomers: matchingCustomers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error evaluating segment', error: error.message });
  }
}; 