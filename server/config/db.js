const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/personal-ai-agent';
    
    // Attempt standard connection with short timeout to catch unavailable local MongoDB quickly
    const options = {
      serverSelectionTimeoutMS: 3000,
    };

    try {
      const conn = await mongoose.connect(connStr, options);
      console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Local MongoDB not reachable at ${connStr}. Starting MongoDB Memory Server fallback...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${uri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
