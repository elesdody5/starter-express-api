const mongoose = require("mongoose");

const quickOrderSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  inCity: {
    type: Boolean,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  userPhone: {
    type: String,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: {
    type: String,
  },
  useType: {
    type: String,
  },
  count: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  photo: { type: String },
  price: {
    type: Number,
  },
  withDeliveryTime: {
    type: String,
  },
});

const QuickOrder = new mongoose.model("QuickOrder", quickOrderSchema);
module.exports = QuickOrder;
