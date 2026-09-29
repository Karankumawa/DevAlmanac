const Track = require('../models/Track');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { inMemoryData, isMongooseConnected } = require('../utils/dataStore');

// @desc    Get full lesson content by track slug and lesson slug
// @route   GET /api/lessons/:trackSlug/:lessonSlug
exports.getLessonBySlug = async (req, res) => {
  try {
    const { trackSlug, lessonSlug } = req.params;
    const lowerTrack = trackSlug.toLowerCase();
    const lowerLesson = lessonSlug.toLowerCase();

    if (isMongooseConnected()) {
      const track = await Track.findOne({ slug: lowerTrack });
      if (!track) {
        return res.status(404).json({
          success: false,
          message: `Track not found: ${trackSlug}`,
        });
      }

      const lesson = await Lesson.findOne({
        trackId: track._id,
        slug: lowerLesson,
      }).populate('moduleId', 'title difficulty order description');

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: `Lesson not found: ${lessonSlug} in track ${trackSlug}`,
        });
      }

      // Calculate prev/next
      const allLessons = await Lesson.find({ trackId: track._id })
        .select('title slug moduleId order')
        .sort({ order: 1 })
        .lean();

      const currentIndex = allLessons.findIndex((l) => l._id.toString() === lesson._id.toString());
      const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
      const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

      const breadcrumbs = [
        { label: 'Tracks', url: '/' },
        { label: track.name, url: `/track/${track.slug}` },
        { label: lesson.moduleId ? lesson.moduleId.title : 'Module', url: `/track/${track.slug}` },
        { label: lesson.title, url: `/track/${track.slug}/${lesson.slug}`, active: true },
      ];

      return res.json({
        success: true,
        source: 'mongodb',
        data: {
          lesson,
          track: {
            _id: track._id,
            name: track.name,
            slug: track.slug,
            icon: track.icon,
            color: track.color,
          },
          module: lesson.moduleId,
          breadcrumbs,
          navigation: {
            prev: prevLesson ? { title: prevLesson.title, slug: prevLesson.slug } : null,
            next: nextLesson ? { title: nextLesson.title, slug: nextLesson.slug } : null,
            totalInTrack: allLessons.length,
            currentIndex: currentIndex + 1,
          },
        },
      });
    }

    // Fallback: In-Memory Data Store
    const track = inMemoryData.tracks.find((t) => t.slug === lowerTrack);
    if (!track) {
      return res.status(404).json({
        success: false,
        message: `Track not found: ${trackSlug}`,
      });
    }

    const lesson = inMemoryData.lessons.find(
      (l) => l.trackId.toString() === track._id.toString() && l.slug === lowerLesson
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: `Lesson not found: ${lessonSlug} in track ${trackSlug}`,
      });
    }

    const module = inMemoryData.modules.find(
      (m) => m._id.toString() === lesson.moduleId.toString()
    );

    const allLessons = inMemoryData.lessons
      .filter((l) => l.trackId.toString() === track._id.toString())
      .sort((a, b) => a.order - b.order);

    const currentIndex = allLessons.findIndex((l) => l._id.toString() === lesson._id.toString());
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const breadcrumbs = [
      { label: 'Tracks', url: '/' },
      { label: track.name, url: `/track/${track.slug}` },
      { label: module ? module.title : 'Module', url: `/track/${track.slug}` },
      { label: lesson.title, url: `/track/${track.slug}/${lesson.slug}`, active: true },
    ];

    return res.json({
      success: true,
      source: 'memory_fallback',
      data: {
        lesson,
        track: {
          _id: track._id,
          name: track.name,
          slug: track.slug,
          icon: track.icon,
          color: track.color,
        },
        module,
        breadcrumbs,
        navigation: {
          prev: prevLesson ? { title: prevLesson.title, slug: prevLesson.slug } : null,
          next: nextLesson ? { title: nextLesson.title, slug: nextLesson.slug } : null,
          totalInTrack: allLessons.length,
          currentIndex: currentIndex + 1,
        },
      },
    });
  } catch (err) {
    console.error('Error in getLessonBySlug:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching lesson',
      error: err.message,
    });
  }
};
