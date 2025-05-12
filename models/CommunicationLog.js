const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true
  },
  deliveryReceipt: {
    type: Object,
    default: {}
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

communicationLogSchema.index({ campaign: 1 });
communicationLogSchema.index({ customer: 1 });
communicationLogSchema.index({ status: 1 });

module.exports = mongoose.model('CommunicationLog', communicationLogSchema); 