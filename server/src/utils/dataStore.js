// Memory Data Store fallback to guarantee 100% uptime and immediate response
// even while MongoDB is starting or connecting.
const mongoose = require('mongoose');
const rawCurriculum = require('../data/curriculumData');

// Pre-compute structured in-memory records with stable ObjectIds
const inMemoryData = {
  tracks: [],
  modules: [],
  lessons: [],
};

// Seed in-memory cache
rawCurriculum.forEach((item) => {
  const trackId = new mongoose.Types.ObjectId();
  const trackObj = {
    _id: trackId,
    ...item.track,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  inMemoryData.tracks.push(trackObj);

  (item.modules || []).forEach((mod) => {
    const moduleId = new mongoose.Types.ObjectId();
    const { lessons, ...modFields } = mod;
    const modObj = {
      _id: moduleId,
      trackId,
      ...modFields,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryData.modules.push(modObj);

    (lessons || []).forEach((les) => {
      const lessonId = new mongoose.Types.ObjectId();
      const lesObj = {
        _id: lessonId,
        trackId,
        moduleId,
        ...les,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryData.lessons.push(lesObj);
    });
  });
});

// In-memory progress tracking fallback
const inMemoryProgress = {};

const isMongooseConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  inMemoryData,
  inMemoryProgress,
  isMongooseConnected,
};
