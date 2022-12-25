const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
// const cloudinary = require("cloudinary").v2;
var fs = require("fs");
const Record = require("../models/recordModel");
const cloudinary = require("../utils/cloudinaryConfiguration");

exports.audioUpload = catchAsync(async (req, res, next) => {
  // Get the file name and extension with multer
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

  // Filter the file to validate if it meets the required audio extension
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "audio/mp3" || file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(
        {
          message: "Unsupported File Format",
        },
        false
      );
    }
  };

  // Set the storage, file filter and file size with multer
  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
  }).single("audio");
  // upload to cloudinary
  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    const { path } = req.file; // file becomes available in req at this point

    const fName = req.file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      path,
      {
        resource_type: "auto",
        public_id: `AudioUploads/${fName}`,
      },

      // Send cloudinary response or catch error
      async (err, audio) => {
        if (err) return res.send(err);

        fs.unlinkSync(path);

        let createdObject = await Record.create({
          audio: audio.url,
          quickOrder: req.query.quickOrderId,
          public_id: audio.public_id,
        });

        res.send(createdObject);
      }
    );
  });
});
