const { Schema, model } = require('mongoose');

const CartSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
  },
  total: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
  deliveryStatus: {
    type: String,
    default: 'Not delivered',
  },
});

module.exports = model('Cart', CartSchema);
