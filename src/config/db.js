const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Wait for the connection to be fully established
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        // If already connected, resolve immediately
        resolve();
      } else {
        // Otherwise wait for the open event
        mongoose.connection.once('open', () => {
          resolve();
        });
      }
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error; // Re-throw the error so it can be caught by the caller
  }
};

module.exports = connectDB;