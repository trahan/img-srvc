const gm = require('gm');

const sizes = {
  tiny: [100,100],
  small: [300,300],
  medium: [500,500],
  large: [1000,1000]
};

/*
  ImageClient

  Client used for saving, loading, and manipulating images.  This class
  stores that raw image data in S3 and metadata in a postgres database.

  Images can be resized when loading.  This class uses GraphicsMagick under
  the covers, so it can easily be extended for other operations.
*/
class ImageClient {
  constructor(s3, db) {
    this._s3 = s3;
    this._db = db;
  }

  saveImage(contentType, imageName, imageSize, imageData) {
    return this._s3.uploadImage(contentType, imageData)
      .then((key) => this._saveFileKey(contentType, imageName, imageSize, key))
      .then((result) => result[0])
  }

  listImages() {
    return this._db.select('id', 'name', 'content_type', 'size').from('files')
  }

  loadAndResize(id, sizeName) {
    var state = {}
    return this._loadImageMetadata(id)
      .then((metadata) => {
        state.name = metadata.name;
        state.contentType = metadata.content_type;
        return this._s3.loadImage(metadata.s3_key);
      })
      .then((image) => this._resizeImage(state.contentType, sizeName, state.name, image));
  }

  _saveFileKey(contentType, imageName, imageSize, key) {
    return this._db('files')
      .returning('id')
      .insert({
        name: imageName,
        s3_key: key,
        content_type: contentType,
        size: imageSize
      });
  }

  _loadImageMetadata(id) {
    return this._db.select('id','name', 'content_type', 's3_key')
      .from('files')
      .where('id', id)
      .then((result) => result[0]);
  }

  _resizeImage(contentType, sizeName, imageName, imageData) {
    if (sizeName == 'original') {
      return {contentType: contentType, imageData: imageData}
    }

    var size = sizes[sizeName]
    if (size == null) {
      size = [500,500];
    }

    return new Promise((resolve, reject) => {
      gm(imageData, imageName)
        .resize(size[0],size[1])
        .toBuffer('JPEG', (err, buffer) => {
          if (err) reject(err);
          resolve({contentType: contentType, imageData: buffer});
        })
    });
  }
}

module.exports = ImageClient;