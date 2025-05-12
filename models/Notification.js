const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['campaign', 'customer', 'system', 'alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return this.save();
};

// Static method to create system notification
notificationSchema.statics.createSystemNotification = async function(userId, title, message, priority = 'medium') {
  return this.create({
    user: userId,
    type: 'system',
    title,
    message,
    priority
  });
};

// Static method to create campaign notification
notificationSchema.statics.createCampaignNotification = async function(userId, campaignId, title, message) {
  return this.create({
    user: userId,
    type: 'campaign',
    title,
    message,
    data: { campaignId }
  });
};

// Static method to create customer notification
notificationSchema.statics.createCustomerNotification = async function(userId, customerId, title, message) {
  return this.create({
    user: userId,
    type: 'customer',
    title,
    message,
    data: { customerId }
  });
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ user: userId, read: false });
};

// Static method to get recent notifications
notificationSchema.statics.getRecent = async function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 