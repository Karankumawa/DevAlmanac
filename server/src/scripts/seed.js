require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { connectDB, closeDB } = require('../config/db');
const Track = require('../models/Track');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const curriculum = require('../data/curriculumData');

const seedDatabase = async (silent = false) => {
  try {
    if (!silent) console.log('🌱 Starting DevAlmanac Database Seeding...');
    await connectDB();

    // Clear existing curriculum data
    await Track.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    if (!silent) console.log('🧹 Purged existing tracks, modules, and lessons.');

    let totalTracks = 0;
    let totalModules = 0;
    let totalLessons = 0;

    for (const item of curriculum) {
      // 1. Create Track
      const track = await Track.create(item.track);
      totalTracks++;
      if (!silent) console.log(`📁 Created Track: ${track.name} [${track.slug}]`);

      // 2. Create Modules
      for (const modData of item.modules) {
        const { lessons, ...moduleFields } = modData;
        const moduleDoc = await Module.create({
          ...moduleFields,
          trackId: track._id,
        });
        totalModules++;

        // 3. Create Lessons
        if (lessons && lessons.length > 0) {
          for (const lessonData of lessons) {
            await Lesson.create({
              ...lessonData,
              trackId: track._id,
              moduleId: moduleDoc._id,
            });
            totalLessons++;
          }
        }
      }
    }

    // Build & Sync Text Search indexes
    await Lesson.syncIndexes();
    if (!silent) {
      console.log('⚡ Synchronized MongoDB Text Search indexes.');
      console.log(`\n==============================================`);
      console.log(`🎉 Seed Completed Successfully!`);
      console.log(`   Tracks   : ${totalTracks}`);
      console.log(`   Modules  : ${totalModules}`);
      console.log(`   Lessons  : ${totalLessons}`);
      console.log(`==============================================\n`);
    }

    return { totalTracks, totalModules, totalLessons };
  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
    throw err;
  }
};

// If run directly from CLI (e.g. node server/src/scripts/seed.js)
if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await closeDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
