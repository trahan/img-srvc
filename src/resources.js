"use strict";

/*
  Resources module

  Manages process scoped objects like db clients or service clients. These
  should only be created once and reused throughout the app.
*/
const config = require('./config');

var AWS = require('aws-sdk');
var uuid = require('uuid');

class FileClient {
  constructor(s3) {
    this.s3 = s3;
  }

  uploadImage(contentType, buffer) {
    var key = `img-${uuid.v4()}`;
    var params = {
      Bucket: config.S3_BUCKET,
      Key: `images/${key}`,
      Body: buffer,
      ContentType: contentType
    };
    console.log(key, params);
    return this.s3.putObject(params).promise()
      .then(function (data) {
        console.log("PutObject");
        console.log(data);
        return key;
      })
  }

  loadImage(key) {
    var params = {
      Bucket: config.S3_BUCKET,
      Key: `images/${key}`,
    };
    return this.s3.getObject(params).promise()
      .then(function (data) {
        return data.Body
      });
  }
}

module.exports = {

  db: require('knex')({
    client: 'pg',
    connection: {
      database : 'img-srvc',
      host : config.DB_HOST,
      user : config.DB_USER,
      password : config.DB_PASSWORD
    }
  }),

  fileClient: new FileClient(new AWS.S3)
};