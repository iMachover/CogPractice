const serverless = require('serverless-http');
const app = require('./server');

// Wrap the Express app so AWS Lambda can consume it
module.exports.handler = serverless(app);
