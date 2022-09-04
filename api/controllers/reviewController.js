//THIS COntroller is about users creating reviews about the delivery bois

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Review = require("./../models/reviewModel");
const ErrorMsgs = require("./../utils/ErrorMsgsConstants");

//@desc Create a review for a delivery
//@route POST /api/v1/reviews/ => pass delivery id in the query
//access PRIVATE -> You have to be logged in.

exports.addReview = catchAsync(async (req, res, next) => {
  //Firstly we are gonna take the ID of the logged in user to be the reviewPoster
  //Secondly we will take the delivery id as a query param.
  //Thirdly we are gonna attach them to the body object and create the reivew with them.
  req.body.reviewPoster = req.user._id;
  req.body.delivery = req.query.deliveryId;

  let review = await Review.create(req.body);
  res.status(200).json({
    status: "success",
    review,
  });
});

//@desc Get all review for specific delivery
//@route Get /api/v1/reviews/deliveryReviews => pass delivery id in the query
//access Public
exports.getAllReviewsForAdelivery = catchAsync(async (req, res, next) => {
  let reviewsForSpecificDelivery = await Review.find({
    delivery: req.query.deliveryId,
  });
  res.status(200).json({
    status: "success",
    review: reviewsForSpecificDelivery,
    count: reviewsForSpecificDelivery.length,
  });
});

//@desc Get all review for specific delivery
//@route Get /api/v1/reviews/ => pass delivery id in the query
//access Private
exports.deleteReview = catchAsync(async (req, res, next) => {
  let review = await Review.findOneAndDelete({ _id: req.query.reviewId });
  res.status(200).json({
    status: "success",
    review,
  });
});
