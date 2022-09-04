const express = require("express");
const router = express.Router(); //We created sub application for orders
const {
  checkForIdExistenceAndValidityUser,
  checkForIdExistenceAndValidityOrder,
} = require("../utils/checkForId");
const { protect } = require("./../controllers/authController");

const {
  createOrder,
  getOrdersForUser,
  getOrderById,
  getOrdersForDelivery,
  deleteOrders,
  getAllOrders,
  getAllOrdersForSpecificShop,
  updateDeliveryForOrderItems,
} = require("../controllers/orderController");

router
  .route("/order")
  .post(protect, createOrder)
  .get(checkForIdExistenceAndValidityOrder, getOrderById)
  .patch(checkForIdExistenceAndValidityUser, updateDeliveryForOrderItems);

//Route to delete many orders passed in the body as an array

router.route("/").delete(deleteOrders).get(getAllOrders);
router.route("/userOrders").get(protect, getOrdersForUser);
router.route("/shopOrders").get(getAllOrdersForSpecificShop);

router
  .route("/ordersForDelivery")
  .get(checkForIdExistenceAndValidityUser, getOrdersForDelivery);

module.exports = router;
