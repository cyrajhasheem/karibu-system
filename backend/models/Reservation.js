const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  table_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  guest_name:  { type: String, required: true },
  guest_phone: { type: String, required: true },
  reserved_at: { type: Date, required: true },
  party_size:  { type: Number, required: true },
  status:      { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);