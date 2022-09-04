const catchAsync = require("../utils/catchAsync");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.createCart = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId, shopId } = req.query;
  const product = await Product.findById(productId);
  let total = Number(product.price) * Number(quantity);
  //Body of the cart to be created
  let body = {
    total,
    user: req.user._id,
    product: productId,
    shop: shopId,
    quantity,
    deliveryStatus: req.body.deliveryStatus,
  };

  let cart = await Cart.create(body);
  res.status(200).json({
    status: "success",
    cart,
  });
});
