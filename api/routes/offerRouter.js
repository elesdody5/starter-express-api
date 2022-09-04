const express = require("express");
const router = express.Router(); //We created sub application for products
const { protect } = require("./../controllers/authController");
const { uploadPhoto, resizePhoto } = require("../utils/multerConfiguration");
const {
  createOffer,
  deleteOfferById,
  getOffersForShop,
  getAllOffers,
  updateOfferById,
} = require("../controllers/offerController");

const {
  checkForIdExistenceAndValidityOffer,
  checkForIdExistenceAndValidityShop,
} = require("../utils/checkForId");

router
  .route("/offer")
  .post(
    checkForIdExistenceAndValidityShop,
    uploadPhoto,
    resizePhoto,
    createOffer
  )
  .delete(checkForIdExistenceAndValidityOffer, deleteOfferById)
  .patch(
    checkForIdExistenceAndValidityOffer,
    uploadPhoto,
    resizePhoto,
    updateOfferById
  );

router.route("/").get(getAllOffers);

router
  .route("/shopOffers")
  .get(checkForIdExistenceAndValidityShop, getOffersForShop);

module.exports = router;
