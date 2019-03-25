/*
  Resources module

  Manages process scoped objects like db clients or service clients. These
  should only be created once and reused throughout the app.
*/
const config = require('./config');

var AWS = require('aws-sdk');
var uuid = require('uuid');

class S3Client {
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
    return this.s3.putObject(params).promise()
      .then((data) => {
        return key;
      })
  }

  loadImage(key) {
    var params = {
      Bucket: config.S3_BUCKET,
      Key: `images/${key}`,
    };
    return this.s3.getObject(params).promise()
      .then((data) => {
        return data.Body
      });
  }
}

module.exports = {

  db: require('knex')({
    client: 'pg',
    connection: {
      database : 'ImgSrvc',
      host : config.DB_HOST,
      user : config.DB_USER,
      password : config.DB_PASSWORD
    }
  }),

  s3Client: new S3Client(new AWS.S3)
};