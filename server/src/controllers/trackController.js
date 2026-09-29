const Track = require('../models/Track');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { inMemoryData, isMongooseConnected } = require('../utils/dataStore');

// @desc    Get all tracks
// @route   GET /api/tracks
exports.getAllTracks = async (req, res) => {
  try {
    if (isMongooseConnected()) {
      const tracks = await Track.find().sort({ order: 1 });

      const enhancedTracks = await Promise.all(
        tracks.map(async (track) => {
          const moduleCount = await Module.countDocuments({ trackId: track._id });
          const lessonCount = await Lesson.countDocuments({ trackId: track._id });
          const modules = await Module.find({ trackId: track._id }).select('difficulty');
          const difficulties = [...new Set(modules.map((m) => m.difficulty))];

          return {
            ...track.toObject(),
            moduleCount,
            lessonCount,
            difficulties,
          };
        })
      );

      return res.json({
        success: true,
        source: 'mongodb',
        count: enhancedTracks.length,
        data: enhancedTracks,
      });
    }

    // Fallback: In-Memory Data Store
    const tracksWithStats = inMemoryData.tracks.map((track) => {
      const modules = inMemoryData.modules.filter((m) => m.trackId.toString() === track._id.toString());
      const lessons = inMemoryData.lessons.filter((l) => l.trackId.toString() === track._id.toString());
      const difficulties = [...new Set(modules.map((m) => m.difficulty))];

      return {
        ...track,
        moduleCount: modules.length,
        lessonCount: lessons.length,
        difficulties,
      };
    });

    return res.json({
      success: true,
      source: 'memory_fallback',
      count: tracksWithStats.length,
      data: tracksWithStats,
    });
  } catch (err) {
    console.error('Error in getAllTracks:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tracks',
      error: err.message,
    });
  }
};

// @desc    Get single track by slug with modules and lesson tree
// @route   GET /api/tracks/:slug
exports.getTrackBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const lowerSlug = slug.toLowerCase();

    if (isMongooseConnected()) {
      const track = await Track.findOne({ slug: lowerSlug });
      if (!track) {
        return res.status(404).json({
          success: false,
          message: `Track not found with slug: ${slug}`,
        });
      }

      const modules = await Module.find({ trackId: track._id }).sort({ order: 1 });
      const modulesWithLessons = await Promise.all(
        modules.map(async (mod) => {
          const lessons = await Lesson.find({
            moduleId: mod._id,
            trackId: track._id,
          })
            .sort({ order: 1 })
            .select('title slug overview estimatedReadTime order practiceChallenge commonPitfalls');

          return {
            ...mod.toObject(),
            lessons: lessons.map((l) => ({
              _id: l._id,
              title: l.title,
              slug: l.slug,
              overview: l.overview,
              estimatedReadTime: l.estimatedReadTime,
              order: l.order,
              hasPractice: Boolean(l.practiceChallenge && l.practiceChallenge.problem),
              pitfallsCount: l.commonPitfalls ? l.commonPitfalls.length : 0,
            })),
          };
        })
      );

      const totalLessons = modulesWithLessons.reduce((acc, m) => acc + m.lessons.length, 0);

      return res.json({
        success: true,
        source: 'mongodb',
        data: {
          ...track.toObject(),
          totalLessons,
          modules: modulesWithLessons,
        },
      });
    }

    // Fallback: In-Memory Data Store
    const track = inMemoryData.tracks.find((t) => t.slug === lowerSlug);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: `Track not found with slug: ${slug}`,
      });
    }

    const modules = inMemoryData.modules
      .filter((m) => m.trackId.toString() === track._id.toString())
      .sort((a, b) => a.order - b.order);

    const modulesWithLessons = modules.map((mod) => {
      const lessons = inMemoryData.lessons
        .filter(
          (l) =>
            l.moduleId.toString() === mod._id.toString() &&
            l.trackId.toString() === track._id.toString()
        )
        .sort((a, b) => a.order - b.order)
        .map((l) => ({
          _id: l._id,
          title: l.title,
          slug: l.slug,
          overview: l.overview,
          estimatedReadTime: l.estimatedReadTime,
          order: l.order,
          hasPractice: Boolean(l.practiceChallenge && l.practiceChallenge.problem),
          pitfallsCount: l.commonPitfalls ? l.commonPitfalls.length : 0,
        }));

      return {
        ...mod,
        lessons,
      };
    });

    const totalLessons = modulesWithLessons.reduce((acc, m) => acc + m.lessons.length, 0);

    return res.json({
      success: true,
      source: 'memory_fallback',
      data: {
        ...track,
        totalLessons,
        modules: modulesWithLessons,
      },
    });
  } catch (err) {
    console.error('Error in getTrackBySlug:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching track details',
      error: err.message,
    });
  }
};
