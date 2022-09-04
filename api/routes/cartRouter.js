const express = require("express");
const router = express.Router(); //We created sub application for carts

const { createCart } = require("../controllers/cartController");
const { protect } = require("./../controllers/authController");
const {
  checkForIdExistenceAndValidityProduct,
  checkForIdExistenceAndValidityShop,
} = require("../utils/checkForId");

router
  .route("/cart")
  .post(
    protect,
    checkForIdExistenceAndValidityProduct,
    checkForIdExistenceAndValidityShop,
    createCart
  );

module.exports = router;
