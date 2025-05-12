const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Segment name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Rules for segment membership
  rules: [{
    field: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'between'],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }],
  // Segment type
  type: {
    type: String,
    enum: ['static', 'dynamic'],
    default: 'static'
  },
  // Segment metrics
  metrics: {
    customerCount: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  // Segment status
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  // Segment tags
  tags: [{
    type: String,
    trim: true
  }],
  // Created by
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Last modified by
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
segmentSchema.index({ name: 1 });
segmentSchema.index({ type: 1 });
segmentSchema.index({ status: 1 });
segmentSchema.index({ tags: 1 });

// Method to evaluate if a customer matches segment rules
segmentSchema.methods.evaluateCustomer = function(customer) {
  return this.rules.every(rule => {
    const value = this.getCustomerValue(customer, rule.field);
    return this.evaluateRule(value, rule);
  });
};

// Helper method to get customer value based on field path
segmentSchema.methods.getCustomerValue = function(customer, field) {
  return field.split('.').reduce((obj, key) => obj && obj[key], customer);
};

// Helper method to evaluate a single rule
segmentSchema.methods.evaluateRule = function(value, rule) {
  switch (rule.operator) {
    case 'equals':
      return value === rule.value;
    case 'not_equals':
      return value !== rule.value;
    case 'contains':
      return value && value.toString().includes(rule.value);
    case 'not_contains':
      return value && !value.toString().includes(rule.value);
    case 'greater_than':
      return value > rule.value;
    case 'less_than':
      return value < rule.value;
    case 'between':
      return value >= rule.value[0] && value <= rule.value[1];
    default:
      return false;
  }
};

// Method to update segment metrics
segmentSchema.methods.updateMetrics = async function(customerCount) {
  this.metrics.customerCount = customerCount;
  this.metrics.lastUpdated = new Date();
  await this.save();
};

module.exports = mongoose.model('Segment', segmentSchema); 