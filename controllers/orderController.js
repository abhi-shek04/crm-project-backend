const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Pub-sub simulation function
function publishToQueue(topic, message) {
  // In a real system, this would publish to Kafka/Redis/etc.
  // For demo, just log to console
  console.log(`[PUB-SUB] Topic: ${topic} | Message:`, JSON.stringify(message));
}

exports.createOrder = async (req, res) => {
  try {
    const { customer, amount, status } = req.body;
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(400).json({ message: 'Customer not found' });
    }
    const order = new Order({ customer, amount, status });
    await order.save();
    // Pub-sub simulation: publish event
    publishToQueue('order.created', order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { amount, status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { amount, status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 