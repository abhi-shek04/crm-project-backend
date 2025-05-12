const CommunicationLog = require('../models/CommunicationLog');

exports.createLog = async (req, res) => {
  try {
    const { campaign, customer, status, message } = req.body;
    const log = new CommunicationLog({ campaign, customer, status, message });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await CommunicationLog.find().populate('campaign').populate('customer');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLogsByCampaign = async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ campaign: req.params.campaignId }).populate('campaign').populate('customer');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getLogsByCustomer = async (req, res) => {
  try {
    const logs = await CommunicationLog.find({ customer: req.params.customerId }).populate('campaign').populate('customer');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateLogStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const log = await CommunicationLog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 