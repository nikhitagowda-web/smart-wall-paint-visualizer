const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'My Room Design',
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalImageUrl: {
      type: String,
      required: true,
    },
    wallCoordinates: {
      type: Array, // Stores polygon points selected by user on canvas
      default: [],
    },
    selectedColor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Color',
    },
    opacity: {
      type: Number,
      default: 0.7,
    },
    finish: {
      type: String,
      default: 'matte',
    },
    savedImageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);