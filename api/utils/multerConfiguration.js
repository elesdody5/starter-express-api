//This file to customize resize and upload image to make some process on the image and check if it exists or not.
let multer = require('multer');
let catchAsync = require('./catchAsync');
// MULTER CONFIGURATION SECTION
const multerStorage = multer.memoryStorage();
//To make sure that the uploaded file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//We are creating and exporting a middleware to upload a single photo for a user
exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const extension = req.file.mimetype.split('/')[1];
  req.file.filename = `user-${Date.now()}.${extension}`; //Added it to the req to be able to use it in the next middlewares Ex:(signup handle)
  next();
});
