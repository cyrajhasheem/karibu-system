const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  items: [{
    menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity:     { type: Number, required: true },
    unit_price:   { type: Number, required: true },
    notes:        { type: String }
  }],
  status:          { type: String, enum: ['pending','preparing','ready','delivered'], default: 'pending' },
  estimated_ready: { type: Date },
  total_amount:    { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);