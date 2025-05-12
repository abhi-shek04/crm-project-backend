const Customer = require('../models/Customer');

// Pub-sub simulation function
function publishToQueue(topic, message) {
  // In a real system, this would publish to Kafka/Redis/etc.
  // For demo, just log to console
  console.log(`[PUB-SUB] Topic: ${topic} | Message:`, JSON.stringify(message));
}

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }
    const customer = new Customer({ name, email, phone, address });
    await customer.save();
    // Pub-sub simulation: publish event
    publishToQueue('customer.created', customer);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 