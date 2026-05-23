const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  category:     { type: String, enum: ['food', 'drink', 'liquor'], required: true },
  price:        { type: Number, required: true },
  description:  { type: String },
  image_url:    { type: String },
  is_available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);