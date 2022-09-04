const express = require("express");
const router = express.Router(); //We created sub application for shops
const { protect } = require("./../controllers/authController");
const { uploadPhoto, resizePhoto } = require("../utils/multerConfiguration");

const {
  createShop,
  getAllShops,
  getShopById,
  getShopsByCategory,
  updateShopById,
  deleteShopById,
  getShopsOwner,
  updateNotificationToken,
} = require("../controllers/shopController");
const {
  checkForIdExistenceAndValidityShop,
  checkForIdExistenceAndValidityCategory,
  checkForIdExistenceAndValidityUser,
} = require("../utils/checkForId");

router.get(
  "/shopsForCategory",
  checkForIdExistenceAndValidityCategory,
  getShopsByCategory
); //Get all shops by a category ID
router.route("/").get(getAllShops);
router
  .route("/shop")
  .get(checkForIdExistenceAndValidityShop, getShopById)
  .post(
    protect,
    checkForIdExistenceAndValidityCategory,
    checkForIdExistenceAndValidityUser,
    uploadPhoto,
    resizePhoto,
    createShop
  ) //add a shop and specify a category for it or getting a specific shop
  .delete(checkForIdExistenceAndValidityShop, deleteShopById)
  .patch(
    checkForIdExistenceAndValidityShop,
    uploadPhoto,
    resizePhoto,
    updateShopById
  );
// Endpoint for updating the token
router.patch(
  "/notificationToken",
  checkForIdExistenceAndValidityShop,
  updateNotificationToken
);
router
  .route("/shopsForOwner")
  .get(checkForIdExistenceAndValidityUser, getShopsOwner);

module.exports = router;
