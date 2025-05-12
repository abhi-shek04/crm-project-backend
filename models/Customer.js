const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  // Segmentation fields
  segments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  // Customer status and type
  status: {
    type: String,
    enum: ['active', 'inactive', 'lead', 'prospect'],
    default: 'lead'
  },
  type: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  // Business specific fields
  company: {
    name: String,
    position: String,
    industry: String,
    size: String
  },
  // Purchase history
  purchaseHistory: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    amount: Number,
    date: Date,
    status: String
  }],
  // Communication preferences
  preferences: {
    email: {
      subscribed: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'weekly'
      }
    },
    sms: {
      subscribed: {
        type: Boolean,
        default: false
      }
    }
  },
  // Custom fields
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Analytics
  metrics: {
    totalPurchases: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastPurchaseDate: Date,
    averageOrderValue: {
      type: Number,
      default: 0
    }
  },
  // Communication history
  communicationHistory: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'call', 'meeting'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    subject: String,
    content: String,
    status: String,
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    }
  }],
  // Source tracking
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'other'],
    default: 'website'
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
customerSchema.index({ email: 1 });
customerSchema.index({ 'segments': 1 });
customerSchema.index({ 'tags': 1 });
customerSchema.index({ 'status': 1 });
customerSchema.index({ 'type': 1 });
customerSchema.index({ 'company.industry': 1 });

// Method to add a segment
customerSchema.methods.addSegment = async function(segmentId) {
  if (!this.segments.includes(segmentId)) {
    this.segments.push(segmentId);
    await this.save();
  }
};

// Method to remove a segment
customerSchema.methods.removeSegment = async function(segmentId) {
  this.segments = this.segments.filter(id => id.toString() !== segmentId.toString());
  await this.save();
};

// Method to add a tag
customerSchema.methods.addTag = async function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
    await this.save();
  }
};

// Method to update metrics
customerSchema.methods.updateMetrics = async function(order) {
  this.metrics.totalPurchases += 1;
  this.metrics.totalSpent += order.amount;
  this.metrics.lastPurchaseDate = order.date;
  this.metrics.averageOrderValue = this.metrics.totalSpent / this.metrics.totalPurchases;
  await this.save();
};

module.exports = mongoose.model('Customer', customerSchema); 