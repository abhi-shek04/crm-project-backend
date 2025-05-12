const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'push', 'custom'],
    default: 'email'
  },
  audience: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment',
    required: true
  }],
  ruleBuilder: {
    type: Object, // Stores the dynamic rule builder config
    default: {}
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'in_progress', 'completed', 'failed'],
    default: 'draft'
  },
  schedule: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    audienceSize: { type: Number, default: 0 },
    openRate: { type: Number, default: 0 },
    clickRate: { type: Number, default: 0 }
  },
  logs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunicationLog'
  }]
}, {
  timestamps: true
});

campaignSchema.index({ name: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Campaign', campaignSchema); 