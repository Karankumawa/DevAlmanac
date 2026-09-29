const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true,
      index: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    lastActiveLessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee one progress record per user per track
UserProgressSchema.index({ userId: 1, trackId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
