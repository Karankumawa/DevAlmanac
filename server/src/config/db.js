const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || '';
  const isAtlasPlaceholder = uri.includes('<db_password>') || uri.includes('<password>');

  if (uri && !isAtlasPlaceholder) {
    try {
      console.log('Connecting to MongoDB Atlas / Remote Database...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected to Atlas/Remote: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`⚠️ Failed to connect to configured MONGODB_URI: ${err.message}`);
      console.log('Falling back to local In-Memory MongoDB engine so DevAlmanac works seamlessly...');
    }
  } else if (isAtlasPlaceholder) {
    console.warn('⚠️ MONGODB_URI contains password placeholder "<db_password>".');
    console.log('ℹ️  Tip: Replace <db_password> in server/.env with your MongoDB user password.');
    console.log('🚀 Launching embedded high-performance In-Memory MongoDB instance...');
  }

  // Fallback to mongodb-memory-server for zero-friction local development
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`✅ Embedded In-Memory MongoDB started at: ${memUri}`);
    return conn;
  } catch (memErr) {
    console.error('❌ Could not start In-Memory MongoDB:', memErr.message);
    throw memErr;
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, closeDB };
