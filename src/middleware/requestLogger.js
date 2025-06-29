const morgan = require('morgan');
const logger = require('../config/logger');

// Create a custom morgan token for logging the request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Create a stream object with a 'write' function
const stream = {
  write: (message) => logger.info(message.trim()),
};

// Create a middleware function using morgan
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
  { stream }
);

module.exports = requestLogger;