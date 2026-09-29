const Lesson = require('../models/Lesson');
const Track = require('../models/Track');
const Module = require('../models/Module');
const { inMemoryData, isMongooseConnected } = require('../utils/dataStore');

// @desc    Search across lessons, code snippets, and overviews
// @route   GET /api/search?q=:query
exports.searchCurriculum = async (req, res) => {
  try {
    const { q, track } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const query = q.trim();

    if (isMongooseConnected()) {
      let filter = {};
      if (track) {
        const trackDoc = await Track.findOne({ slug: track.toLowerCase() });
        if (trackDoc) {
          filter.trackId = trackDoc._id;
        }
      }

      let textResults = [];
      try {
        textResults = await Lesson.find(
          {
            ...filter,
            $text: { $search: query },
          },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .limit(15)
          .populate('trackId', 'name slug icon color')
          .populate('moduleId', 'title difficulty');
      } catch (textErr) {
        textResults = [];
      }

      let combinedResults = [...textResults];
      const seenIds = new Set(textResults.map((r) => r._id.toString()));

      if (combinedResults.length < 10) {
        const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        const regexResults = await Lesson.find({
          ...filter,
          _id: { $nin: Array.from(seenIds) },
          $or: [
            { title: regex },
            { overview: regex },
            { 'codeSnippets.code': regex },
            { 'codeSnippets.explanation': regex },
            { 'codeSnippets.fileName': regex },
          ],
        })
          .limit(15 - combinedResults.length)
          .populate('trackId', 'name slug icon color')
          .populate('moduleId', 'title difficulty');

        combinedResults = [...combinedResults, ...regexResults];
      }

      const formattedResults = combinedResults.map((lesson) => {
        const matchingSnippet = (lesson.codeSnippets || []).find(
          (s) =>
            (s.code && s.code.toLowerCase().includes(query.toLowerCase())) ||
            (s.fileName && s.fileName.toLowerCase().includes(query.toLowerCase()))
        );

        return {
          _id: lesson._id,
          title: lesson.title,
          slug: lesson.slug,
          overview: lesson.overview,
          estimatedReadTime: lesson.estimatedReadTime,
          track: lesson.trackId
            ? {
                name: lesson.trackId.name,
                slug: lesson.trackId.slug,
                icon: lesson.trackId.icon,
                color: lesson.trackId.color,
              }
            : null,
          module: lesson.moduleId
            ? {
                title: lesson.moduleId.title,
                difficulty: lesson.moduleId.difficulty,
              }
            : null,
          matchedSnippet: matchingSnippet
            ? {
                fileName: matchingSnippet.fileName,
                language: matchingSnippet.language,
                sample: matchingSnippet.code.slice(0, 150),
              }
            : null,
        };
      });

      return res.json({
        success: true,
        source: 'mongodb',
        query,
        count: formattedResults.length,
        data: formattedResults,
      });
    }

    // Fallback: In-Memory Search
    const lowerQuery = query.toLowerCase();
    let candidateLessons = inMemoryData.lessons;

    if (track) {
      const trackObj = inMemoryData.tracks.find((t) => t.slug === track.toLowerCase());
      if (trackObj) {
        candidateLessons = candidateLessons.filter(
          (l) => l.trackId.toString() === trackObj._id.toString()
        );
      }
    }

    const matches = candidateLessons
      .filter((lesson) => {
        const titleMatch = lesson.title.toLowerCase().includes(lowerQuery);
        const overviewMatch = lesson.overview.toLowerCase().includes(lowerQuery);
        const contentMatch = (lesson.content || '').toLowerCase().includes(lowerQuery);
        const codeMatch = (lesson.codeSnippets || []).some(
          (s) =>
            s.code.toLowerCase().includes(lowerQuery) ||
            s.fileName.toLowerCase().includes(lowerQuery)
        );
        return titleMatch || overviewMatch || contentMatch || codeMatch;
      })
      .slice(0, 15);

    const formatted = matches.map((lesson) => {
      const trackObj = inMemoryData.tracks.find(
        (t) => t._id.toString() === lesson.trackId.toString()
      );
      const modObj = inMemoryData.modules.find(
        (m) => m._id.toString() === lesson.moduleId.toString()
      );
      const matchingSnippet = (lesson.codeSnippets || []).find(
        (s) =>
          s.code.toLowerCase().includes(lowerQuery) ||
          s.fileName.toLowerCase().includes(lowerQuery)
      );

      return {
        _id: lesson._id,
        title: lesson.title,
        slug: lesson.slug,
        overview: lesson.overview,
        estimatedReadTime: lesson.estimatedReadTime,
        track: trackObj
          ? {
              name: trackObj.name,
              slug: trackObj.slug,
              icon: trackObj.icon,
              color: trackObj.color,
            }
          : null,
        module: modObj
          ? {
              title: modObj.title,
              difficulty: modObj.difficulty,
            }
          : null,
        matchedSnippet: matchingSnippet
          ? {
              fileName: matchingSnippet.fileName,
              language: matchingSnippet.language,
              sample: matchingSnippet.code.slice(0, 150),
            }
          : null,
      };
    });

    return res.json({
      success: true,
      source: 'memory_fallback',
      query,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    console.error('Error in searchCurriculum:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during search',
      error: err.message,
    });
  }
};
