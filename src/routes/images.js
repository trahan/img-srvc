var express = require('express')
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
var gm = require('gm');

const sizes = {
  tiny: [100,100],
  small: [300,300],
  medium: [500,500],
  large: [1000,1000]
};

class Images extends express.Router {
  constructor(s3, db) {
    super();

    // Image Upload
    this.post('/', upload.single('image'), function (req, res) {
      console.log(req.file);
      s3.uploadImage(req.file.mimetype, req.file.buffer)
        .then(function(key) {
          return db('files')
            .returning('id')
            .insert({
              name: req.file.originalname,
              s3_key: key,
              content_type: req.file.mimetype,
              size: req.file.size
            });
        })
        .then(function (id) {
          res.send({id: id});
        })
        .catch(function(err) {
          console.log(err);
          res.status(500).send("Failed");
        })
    })

    // List Images
    this.get('/', function (req, res) {
      db.select('id', 'name', 'content_type', 'size').from('files')
        .then(function (data) {
          res.send(data);
        });
    });

    this.get('/:id', function (req, res) {
      var state = {}
      db.select('id','name', 'content_type', 's3_key').from('files').where('id', req.params.id)
        .then(function (data) {
          console.log(data);
          state.name = data[0].name;
          state.content_type = data[0].content_type;
          return s3.loadImage(data[0].s3_key);
        })
        .then(function (image) {
          if (req.query.size == 'original') {
            res.set('content-type', state.content_type);
            res.send(image);
            return
          }

          var size = sizes[req.query.size]
          if (size == null) {
            size = [500,500];
          }

          gm(image, state.name)
            .resize(size[0],size[1])
            .toBuffer('JPEG', function (err, buffer) {
              if (err) throw err;
              res.set('content-type', state.content_type);
              res.send(buffer);
            });
        })
        .catch(function(err) {
          console.log(err);
          res.status(500).send("Failed");
        })
    });
  }
}

module.exports = Images