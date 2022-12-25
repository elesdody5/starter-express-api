const express = require("express");
const router = express.Router(); //We created sub application for favorites
const { protect } = require("./../controllers/authController");

const {
  checkForIdExistenceAndValidityUser,
  checkForIdExistenceAndValidityShop,
} = require("../utils/checkForId");
const {
  getFavoriteShopsForUser,
  addShopForFavorites,
  removeShopFromFavorites,
} = require("../controllers/favoriteController");

router
  .route("/favorite")
  .get(checkForIdExistenceAndValidityUser, getFavoriteShopsForUser);

router
  .route("/addFavorite")
  .patch(
    checkForIdExistenceAndValidityUser,
    checkForIdExistenceAndValidityShop,
    addShopForFavorites
  );
router
  .route("/removeFavorite")
  .patch(
    checkForIdExistenceAndValidityUser,
    checkForIdExistenceAndValidityShop,
    removeShopFromFavorites
  );

module.exports = router;
