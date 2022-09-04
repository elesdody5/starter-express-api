const express = require("express");
const router = express.Router(); //We created sub application for reviews

const {
  addReview,
  getAllReviewsForAdelivery,
  deleteReview,
} = require("./../controllers/reviewController");
const { protect } = require("./../controllers/authController");

router.route("/").post(protect, addReview).delete(protect, deleteReview);
router.route("/deliveryReviews").get(getAllReviewsForAdelivery);
module.exports = router;
