const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema(
  {
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: [true, 'Track ID is required for a module'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ModuleSchema.index({ trackId: 1, order: 1 });

module.exports = mongoose.model('Module', ModuleSchema);
