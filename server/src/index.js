require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./scripts/seed');
const { isMongooseConnected, inMemoryData } = require('./utils/dataStore');
const Track = require('./models/Track');
const Lesson = require('./models/Lesson');

// Import routes
const trackRoutes = require('./routes/trackRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const searchRoutes = require('./routes/searchRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${req.method}] ${req.originalUrl}`);
  }
  next();
});

// API Routes
app.use('/api/tracks', trackRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/progress', progressRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = isMongooseConnected();
    let trackCount = inMemoryData.tracks.length;
    let lessonCount = inMemoryData.lessons.length;

    if (isConnected) {
      trackCount = await Track.countDocuments();
      lessonCount = await Lesson.countDocuments();
    }

    res.json({
      status: 'healthy',
      platform: 'DevAlmanac API',
      version: '1.0.0',
      database: isConnected ? 'mongodb_active' : 'fallback_in_memory_ready',
      stats: {
        tracks: trackCount,
        lessons: lessonCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
    });
  }
});

// Seed API Endpoint for manual trigger
app.post('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase(false);
    res.json({
      success: true,
      message: 'Database seeded successfully',
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: err.message,
    });
  }
});

// Root API Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevAlmanac API — The definitive multi-language developer almanac.',
    documentation: '/api/health',
    endpoints: [
      'GET /api/tracks',
      'GET /api/tracks/:slug',
      'GET /api/lessons/:trackSlug/:lessonSlug',
      'GET /api/search?q=:query',
      'POST /api/progress/toggle',
      'GET /api/progress/:trackId',
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Start Server immediately and connect to MongoDB in background
const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 DevAlmanac Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Tracks API : http://localhost:${PORT}/api/tracks`);
  console.log(`⚡ In-memory curriculum cache active for instant uptime.`);
  console.log(`==================================================\n`);
});

// Asynchronous DB Connection
connectDB()
  .then(async () => {
    try {
      const count = await Track.countDocuments();
      if (count === 0) {
        console.log('MongoDB connected and empty. Seeding curriculum...');
        await seedDatabase(true);
        console.log('✅ Starter curriculum seeded to MongoDB!');
      } else {
        console.log(`✅ MongoDB ready with ${count} tracks!`);
      }
    } catch (e) {
      console.warn('Seeding check warning:', e.message);
    }
  })
  .catch((err) => {
    console.warn('MongoDB initialization deferred. DevAlmanac continues running on resilient cache:', err.message);
  });
