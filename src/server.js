/*jslint node: true */
"use strict";

const express = require('express');
const config = require('./config');
const resource = require('./resources');

const Images = require('./routes/images');

// App
const app = express();

app.use('/images', new Images(resource.fileClient, resource.db));

app.get('/health', function(req, res) {
  res.send('OK');
})

app.listen(config.SERVER_PORT, config.SERVER_HOST);
console.log(`Running on http://0.0.0.0:${config.SERVER_PORT}`);