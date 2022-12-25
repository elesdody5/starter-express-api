const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  rating: {
    type: Number,
    default: null,
  },
  reviewBody: {
    type: String,
  },
  reviewPoster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
