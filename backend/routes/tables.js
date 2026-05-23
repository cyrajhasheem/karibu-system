const express = require('express');
const router  = express.Router();
const Table   = require('../models/Table');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new table
router.post('/', async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update table status
router.put('/:id/status', async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(table);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;