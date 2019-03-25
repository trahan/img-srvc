const _ = require('lodash');
const express = require('express');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/*
  Image Routes

  Images can be uploaded to:

    POST /images/

    200 {
      id: 0
    }

  This route assumes images are uploaded using multi-part file uploads. Images
  are listed at:

    GET /images/

    200 [
      {
        "id":1,
        "name":"cat.jpeg",
        "content_type":"image/jpeg",
        "size":509580
      }
    ]

  Images are retrieved at:

    GET /images/:id

    200 <image>
*/
class Images extends express.Router {
  constructor(imageClient) {
    super();

    // Image Upload
    this.post('/', upload.single('image'), (req, res) => {
      var { mimetype, originalname, size, buffer } = req.file
      imageClient.saveImage(mimetype, originalname, size, buffer)
        .then((id) => res.send({id: id}))
        .catch(_.partial(error, res));
    })

    // List Images
    this.get('/', (req, res) => {
      imageClient.listImages()
        .then((data) => res.send(data))
        .catch(_.partial(error, res));
    });

    // Load and resize image
    this.get('/:id', (req, res) => {
      imageClient.loadAndResize(req.params.id, req.query.size)
        .then((result) => {
          res.set('content-type', result.contentType);
          res.send(result.imageData)
        })
        .catch(_.partial(error, res));
    });

    function error(res, err) {
      console.log(err);
      res.status(500).send("Internal Service Error");
    }
  }
}

module.exports = Images