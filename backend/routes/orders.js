const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('table_id')
      .populate('items.menu_item_id');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders for a specific table
router.get('/table/:tableId', async (req, res) => {
  try {
    const orders = await Order.find({ table_id: req.params.tableId })
      .populate('items.menu_item_id');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menu_item_id');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Place a new order
router.post('/', async (req, res) => {
  try {
    // Automatically set estimated ready time to 20 minutes from now
    const estimated_ready = new Date(Date.now() + 20 * 60 * 1000);
    const order = new Order({ ...req.body, estimated_ready });
    await order.save();

    // Notify all connected screens in real time
    const io = req.app.get('io');
    io.emit('new_order', order);

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status (admin does this, customer sees it live)
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // Broadcast the status change to all connected screens
    const io = req.app.get('io');
    io.emit('order_status_updated', order);

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;