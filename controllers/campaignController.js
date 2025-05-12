const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const Segment = require('../models/Segment');
// const redis = require('redis');
// const redisPublisher = redis.createClient();
// redisPublisher.connect();

exports.createCampaign = async (req, res) => {
  try {
    const { name, description, type, audience, ruleBuilder, message, schedule } = req.body;
    const campaign = new Campaign({
      name,
      description,
      type,
      audience,
      ruleBuilder,
      message,
      schedule,
      createdBy: req.user.id
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id })
      .populate('audience', 'name')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('audience', 'name')
      .populate('logs');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { name, description, type, audience, ruleBuilder, message, schedule, status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { name, description, type, audience, ruleBuilder, message, schedule, status },
      { new: true, runValidators: true }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deliverCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Simulate delivery to each customer in the audience
    let sent = 0, delivered = 0, failed = 0;
    const logs = [];
    for (const customerId of campaign.audience) {
      sent++;
      // Simulate delivery: 90% success, 10% fail
      const isSuccess = Math.random() < 0.9;
      const status = isSuccess ? 'delivered' : 'failed';
      if (isSuccess) delivered++; else failed++;
      const log = new CommunicationLog({
        campaign: campaign._id,
        customer: customerId,
        status,
        message: campaign.message,
        deliveryReceipt: isSuccess ? { deliveredAt: new Date() } : {},
        error: isSuccess ? undefined : 'Simulated delivery failure'
      });
      await log.save();
      logs.push(log);
      campaign.logs.push(log._id);
    }
    campaign.status = 'completed';
    campaign.stats.sent = sent;
    campaign.stats.delivered = delivered;
    campaign.stats.failed = failed;
    campaign.stats.audienceSize = campaign.audience.length;
    await campaign.save();
    res.json({ message: 'Campaign delivery simulated', stats: campaign.stats, logs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get campaign stats (history, delivery, etc.)
exports.getCampaignStats = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('logs');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ stats: campaign.stats, logs: campaign.logs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Get all campaigns for the user
    const campaigns = await Campaign.find({ createdBy: req.user.id });
    // Aggregate stats
    let totalSent = 0, totalDelivered = 0, totalFailed = 0, totalAudience = 0;
    const campaignStats = campaigns.map(c => {
      totalSent += c.stats.sent;
      totalDelivered += c.stats.delivered;
      totalFailed += c.stats.failed;
      totalAudience += c.stats.audienceSize;
      return {
        id: c._id,
        name: c.name,
        sent: c.stats.sent,
        delivered: c.stats.delivered,
        failed: c.stats.failed,
        audienceSize: c.stats.audienceSize,
        openRate: c.stats.openRate,
        clickRate: c.stats.clickRate,
        createdAt: c.createdAt
      };
    });
    // Audience growth: count unique customers across all campaigns
    const audienceSet = new Set();
    campaigns.forEach(c => c.audience.forEach(a => audienceSet.add(a.toString())));
    const audienceGrowth = audienceSet.size;
    res.json({
      totalSent,
      totalDelivered,
      totalFailed,
      totalAudience,
      audienceGrowth,
      campaigns: campaignStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 