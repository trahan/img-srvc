const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');
const config = require('./config');
const resource = require('./resources');

const ImageRoutes = require('./routes/images');
const ImageClient = require('./clients/imageClient');


// App
const app = express();
const imageClient = new ImageClient(resource.s3Client, resource.db);

// Request Logging
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.json()
}));

// Routes
app.use('/images', new ImageRoutes(imageClient));

app.get('/health', (req, res) => {
  res.send('OK');
})

app.get('/', (req, res) => {
  res.send('Welcome to image-srvc!');
})

// Error Logging
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.json()
}));

// Start server
app.listen(config.SERVER_PORT, config.SERVER_HOST);
console.log(`Running on http://0.0.0.0:${config.SERVER_PORT}`);