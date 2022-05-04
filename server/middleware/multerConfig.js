const multer = require('multer');
const path = require('path');
const fs = require("fs");
const $sizeInByte = 2000000;

const storageConfig = multer.diskStorage({
  destination: function(req, file, cb) {
    fs.stat('server/public/post-images', function(err) {
      if (!err) {
        cb(null, 'server/public/post-images');
      }
      else if (err.code === 'ENOENT') {
        fs.mkdir('server/public/post-images', function(err) {
          if (err) {
            console.log(err.stack);
          }
          else {
            cb(null, 'server/public/post-images');
          }
        })
      }
    });
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadImage = multer({
  storage: storageConfig,
  limits: {fileSize: $sizeInByte},
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  else {
    cb('Error: images only!');
  }
}

module.exports = uploadImage;
