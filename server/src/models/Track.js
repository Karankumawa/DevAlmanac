const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Track name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Track slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Track description is required'],
    },
    icon: {
      type: String,
      default: 'code',
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    color: {
      type: String,
      default: '#38bdf8', // accent color for UI
    },
    badgeText: {
      type: String,
      default: 'Core Track',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Track', TrackSchema);
