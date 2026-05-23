const express     = require('express');
const router      = express.Router();
const RoomBooking = require('../models/RoomBooking');
const Room        = require('../models/Room');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await RoomBooking.find().populate('room_id');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a booking
router.post('/', async (req, res) => {
  try {
    const booking = new RoomBooking(req.body);
    await booking.save();
    // Automatically mark the room as unavailable
    await Room.findByIdAndUpdate(req.body.room_id, { is_available: false });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const booking = await RoomBooking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    // If checked out or cancelled, mark room as available again
    if (['checked_out', 'cancelled'].includes(req.body.status)) {
      await Room.findByIdAndUpdate(booking.room_id, { is_available: true });
    }
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await RoomBooking.findByIdAndDelete(req.params.id);
    // Mark the room available again
    await Room.findByIdAndUpdate(booking.room_id, { is_available: true });
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;