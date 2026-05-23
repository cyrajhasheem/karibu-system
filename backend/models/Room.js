const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  room_number:      { type: String, required: true, unique: true },
  type:             { type: String, enum: ['single','double','suite','family'], required: true },
  price_per_night:  { type: Number, required: true },
  description:      { type: String },
  image_url:        { type: String },
  is_available:     { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);