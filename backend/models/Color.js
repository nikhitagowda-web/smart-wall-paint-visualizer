const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hexCode: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      default: 'Behr Paint',
    },
    finish: {
      type: String,
      enum: ['matte', 'glossy', 'satin', 'eggshell'],
      default: 'matte',
    },
    category: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Color', colorSchema);