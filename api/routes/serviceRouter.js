const express = require("express");
const router = express.Router(); //We created sub application for products
const {
  checkForIdExistenceAndValidityService,
} = require("../utils/checkForId");
const { uploadPhoto, resizePhoto } = require("../utils/multerConfiguration");
const {
  createService,
  deleteServiceById,
  getAllServices,
  updateServiceById,
  getServiceById,
} = require("../controllers/serviceController");

router.route("/").get(getAllServices);
router
  .route("/service")
  .post(uploadPhoto, resizePhoto, createService)
  .get(checkForIdExistenceAndValidityService, getServiceById)
  .delete(checkForIdExistenceAndValidityService, deleteServiceById)
  .patch(
    checkForIdExistenceAndValidityService,
    uploadPhoto,
    resizePhoto,
    updateServiceById
  );

module.exports = router;
