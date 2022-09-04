const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
// const Cart = require('../models/cartModel');
const AppError = require('./../utils/appError');
// const { ObjectId } = require('mongodb');

//@desc Create Order
//@route POST /api/orders/order
//@access Private //User must be logged in
exports.createOrder = catchAsync(async (req, res, next) => {
  //Delivery in body refers to the delivery boy who will deliver the order.
  const { orderItems } = req.body;
  // let carts = await Cart.find({ user: req.user._id }).select('-user');

  let wholeBody = {
    ...req.body,
    user: req.user._id,
    // orderItems: carts,
  };
  if (orderItems && orderItems.length === 0) {
    return next(new AppError(' عفوا لا يوجد منتجات ', 400));
  } else {
    let order = await Order.create(wholeBody);
    res.status(200).json({
      status: 'success',
      order,
    });
  }
  //TODO:Notify all shops in the order and all the delivery boys
});

//@desc Get Order
//@route Get /api/orders/userOrders
//@access Private //User must be logged in
exports.getOrdersForUser = catchAsync(async (req, res, next) => {
  let userOrders = await Order.find({ user: req.user._id });
  res.status(200).json({
    status: 'success',
    count: userOrders.length,
    userOrders,
  });
});

//@desc Get Order by id
//@route Get /api/orders/order
//@access Public
exports.getOrderById = catchAsync(async (req, res, next) => {
  let { orderId } = req.query;
  let order = await Order.findById(orderId);
  res.status(200).json({
    status: 'success',
    order,
  });
});
//@desc Get Orders for delivery boys
//@route Get /api/orders/ordersForDelivery
//@access Private
exports.getOrdersForDelivery = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  let ordersForDelivery = await Order.find({ delivery: userId });
  res.status(200).json({
    status: 'success',
    count: ordersForDelivery.length,
    ordersForDelivery,
  });
});

//@desc Delete Orders
//@route Delete /api/orders/
//@access Public
exports.deleteOrders = catchAsync(async (req, res, next) => {
  if (req.body.orders.length === 0) {
    return next(new AppError('من فضلك ادخل الاوردرات صحيحا'));
  }
  let { orders } = req.body;
  let deletedMedicine = await Order.deleteMany({
    _id: {
      $in: orders,
    },
  });
  res.status(200).json({
    status: 'success',
    count: deletedMedicine.deletedCount,
  });
});

//@desc Get all Orders
//@route Get /api/orders/
//@access Public
exports.getAllOrders = catchAsync(async (req, res, next) => {
  let orders = await Order.find();
  res.status(200).json({
    status: 'success',
    count: orders.length,
    orders,
  });
});

//@desc Get all Orders for specific shop ==> id for the shop is passed
//@route GET /api/orders/shopOrders
//@access Private
exports.getAllOrdersForSpecificShop = catchAsync(async (req, res, next) => {
  let { shopId } = req.query;
  let orders = await Order.find();
  let orderItemsClone = [];

  orders.forEach(
    ({ orderItems, delivery, user }) =>
      (orderItemsClone = orderItems.map((orderItem) =>
        Object.assign(orderItem, { delivery }, { user })
      ))
  );

  let ordersItems = orderItemsClone.filter((item) => {
    return String(item.shopId) == String(shopId);
  });

  res.status(200).json({
    status: 'success',
    ordersItems,
  });
});

//@desc Update all Orders for specific shop ==> id for the shop is passed
//@route PATCH /api/orders/order
//@access Public
exports.updateDeliveryForOrderItems = catchAsync(async (req, res, next) => {
  let { orderId } = req.query; // Represents delivery ID
  let updatedOrder = await Order.findOneAndUpdate(
    { orderId },
    { delivery: req.body.userId },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    updatedOrder,
  });
});
