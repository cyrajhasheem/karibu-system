const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  table_number: { type: String, required: true, unique: true },
  capacity:     { type: Number, required: true },
  status:       { type: String, enum: ['available','occupied','reserved'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Table', TableSchema);