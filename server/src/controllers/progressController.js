const UserProgress = require('../models/UserProgress');
const Lesson = require('../models/Lesson');
const Track = require('../models/Track');
const {
  inMemoryData,
  inMemoryProgress,
  isMongooseConnected,
} = require('../utils/dataStore');

const getUserId = (req) => {
  return (
    (req.body && req.body.userId) ||
    (req.query && req.query.userId) ||
    (req.headers && req.headers['x-user-id']) ||
    'guest-user-default'
  );
};

// @desc    Toggle lesson completion
// @route   POST /api/progress/toggle
exports.toggleLessonProgress = async (req, res) => {
  try {
    const { lessonId, trackId } = req.body;
    const userId = getUserId(req);

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: 'lessonId is required',
      });
    }

    if (isMongooseConnected()) {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: 'Lesson not found',
        });
      }

      const resolvedTrackId = trackId || lesson.trackId;

      let progress = await UserProgress.findOne({
        userId,
        trackId: resolvedTrackId,
      });

      if (!progress) {
        progress = new UserProgress({
          userId,
          trackId: resolvedTrackId,
          completedLessons: [],
        });
      }

      const lessonObjIdStr = lesson._id.toString();
      const existingIndex = progress.completedLessons.findIndex(
        (id) => id.toString() === lessonObjIdStr
      );

      let isCompleted = false;

      if (existingIndex > -1) {
        progress.completedLessons.splice(existingIndex, 1);
        isCompleted = false;
      } else {
        progress.completedLessons.push(lesson._id);
        progress.lastActiveLessonId = lesson._id;
        isCompleted = true;
      }

      await progress.save();

      const totalLessons = await Lesson.countDocuments({ trackId: resolvedTrackId });
      const completedCount = progress.completedLessons.length;
      const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return res.json({
        success: true,
        source: 'mongodb',
        data: {
          isCompleted,
          lessonId: lesson._id,
          completedLessons: progress.completedLessons,
          completedCount,
          totalLessons,
          percentage,
          lastActiveLessonId: progress.lastActiveLessonId,
        },
      });
    }

    // Fallback: In-Memory Progress Tracking
    const lesson = inMemoryData.lessons.find((l) => l._id.toString() === lessonId.toString());
    const resolvedTrackId = trackId || (lesson ? lesson.trackId.toString() : '');

    const cacheKey = `${userId}_${resolvedTrackId}`;
    if (!inMemoryProgress[cacheKey]) {
      inMemoryProgress[cacheKey] = {
        userId,
        trackId: resolvedTrackId,
        completedLessons: [],
        lastActiveLessonId: null,
      };
    }

    const userProg = inMemoryProgress[cacheKey];
    const existingIndex = userProg.completedLessons.indexOf(lessonId.toString());
    let isCompleted = false;

    if (existingIndex > -1) {
      userProg.completedLessons.splice(existingIndex, 1);
      isCompleted = false;
    } else {
      userProg.completedLessons.push(lessonId.toString());
      userProg.lastActiveLessonId = lessonId;
      isCompleted = true;
    }

    const totalLessons = inMemoryData.lessons.filter(
      (l) => l.trackId.toString() === resolvedTrackId.toString()
    ).length;
    const completedCount = userProg.completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return res.json({
      success: true,
      source: 'memory_fallback',
      data: {
        isCompleted,
        lessonId,
        completedLessons: userProg.completedLessons,
        completedCount,
        totalLessons,
        percentage,
        lastActiveLessonId: userProg.lastActiveLessonId,
      },
    });
  } catch (err) {
    console.error('Error in toggleLessonProgress:', err);
    res.status(500).json({
      success: false,
      message: 'Server error updating lesson progress',
      error: err.message,
    });
  }
};

// @desc    Get user completion progress for a track
// @route   GET /api/progress/:trackId
exports.getProgressByTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = getUserId(req);

    if (isMongooseConnected()) {
      let resolvedTrackId = trackId;
      if (!trackId.match(/^[0-9a-fA-F]{24}$/)) {
        const track = await Track.findOne({ slug: trackId.toLowerCase() });
        if (!track) {
          return res.status(404).json({
            success: false,
            message: `Track not found: ${trackId}`,
          });
        }
        resolvedTrackId = track._id;
      }

      const totalLessons = await Lesson.countDocuments({ trackId: resolvedTrackId });
      const progress = await UserProgress.findOne({
        userId,
        trackId: resolvedTrackId,
      });

      const completedLessons = progress ? progress.completedLessons : [];
      const completedCount = completedLessons.length;
      const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return res.json({
        success: true,
        source: 'mongodb',
        data: {
          trackId: resolvedTrackId,
          completedLessons,
          completedCount,
          totalLessons,
          percentage,
          lastActiveLessonId: progress ? progress.lastActiveLessonId : null,
        },
      });
    }

    // Fallback: In-Memory Progress Tracking
    let resolvedTrackId = trackId;
    const trackObj = inMemoryData.tracks.find(
      (t) => t.slug === trackId.toLowerCase() || t._id.toString() === trackId.toString()
    );
    if (trackObj) {
      resolvedTrackId = trackObj._id.toString();
    }

    const totalLessons = inMemoryData.lessons.filter(
      (l) => l.trackId.toString() === resolvedTrackId.toString()
    ).length;

    const cacheKey = `${userId}_${resolvedTrackId}`;
    const userProg = inMemoryProgress[cacheKey] || { completedLessons: [], lastActiveLessonId: null };
    const completedLessons = userProg.completedLessons;
    const completedCount = completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return res.json({
      success: true,
      source: 'memory_fallback',
      data: {
        trackId: resolvedTrackId,
        completedLessons,
        completedCount,
        totalLessons,
        percentage,
        lastActiveLessonId: userProg.lastActiveLessonId,
      },
    });
  } catch (err) {
    console.error('Error in getProgressByTrack:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress',
      error: err.message,
    });
  }
};
