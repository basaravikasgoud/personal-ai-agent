const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(connStr);

  try {
    if (connStr) {
      console.log(`[Database] Connecting to MongoDB Atlas...`);
      const conn = await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout for cloud Atlas connection
      });
      console.log(`[Database] Connected to MongoDB Atlas: ${conn.connection.host}`);
      return conn;
    }

    // Local development connection attempt
    const localUri = 'mongodb://127.0.0.1:27017/personal-ai-agent';
    try {
      const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[Database] Connected to local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[Database] Local MongoDB not reachable. Starting MongoDB Memory Server fallback...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[Database] Connected to In-Memory MongoDB at: ${uri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB Atlas: ${error.message}`);
    console.error(`👉 TIP: Ensure 0.0.0.0/0 (Allow Access from Anywhere) is added to Network Access in MongoDB Atlas.`);
    process.exit(1);
  }
};

module.exports = connectDB;
