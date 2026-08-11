const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hex: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: 'Generic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Color', ColorSchema);