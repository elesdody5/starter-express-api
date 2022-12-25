const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  price: {
    type: Number,
  },
  photo: { type: String },
  description: {
    type: String,
  },
});
const Product = new mongoose.model('Product', productSchema);
module.exports = Product;
