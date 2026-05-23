const mongoose = require('mongoose');

const RoomBookingSchema = new mongoose.Schema({
  room_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  guest_name:  { type: String, required: true },
  guest_phone: { type: String, required: true },
  check_in:    { type: Date, required: true },
  check_out:   { type: Date, required: true },
  status:      { type: String, enum: ['confirmed','checked_in','checked_out','cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('RoomBooking', RoomBookingSchema);