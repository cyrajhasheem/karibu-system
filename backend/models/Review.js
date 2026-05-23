const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  order_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  food_rating:     { type: Number, min: 1, max: 5, required: true },
  service_rating:  { type: Number, min: 1, max: 5, required: true },
  ambiance_rating: { type: Number, min: 1, max: 5, required: true },
  comment:         { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);