const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const QuickOrder = require("./../models/quickOrderModel");
const catchAsync = require("../utils/catchAsync");
const ErrorMsgs = require("./../utils/ErrorMsgsConstants");
const Record = require("../models/recordModel");
const cloudinary = require("../utils/cloudinaryConfiguration");
const { sendMultipleNotification } = require("../utils/sendNotification");
const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require("../utils/firebaseStorage");

//@desc Add quick order and notify all delivery boys
//@route POST /api/v1/quickOrders/
//access PUBLIC
//NOTE we pass here the user who made the quick order in the body of the req.
exports.addQuickOrder = catchAsync(async (req, res, next) => {
  // let quickOrder = await QuickOrder.create(req.body);
  handleStoringImageAndCreatingElement("quickOrders", req, res);
});
//@desc Delete quick order by passing quick order ID
//@route DELETE /api/v1/quickOrders/
//access PUBLIC
exports.deleteQuickOrder = catchAsync(async (req, res, next) => {
  let { quickOrderId } = req.query;
  let deletedQuickOrder = await QuickOrder.findOneAndDelete({
    _id: quickOrderId,
  });

  let foundRecord = await Record.findOne({ quickOrder: quickOrderId });

  if (foundRecord) {
    cloudinary.uploader
      .destroy(foundRecord.public_id, { resource_type: "video" })
      .then((result, err) => {
        res.status(200).json({
          status: "success",
        });
      });
  } else {
    res.status(200).json({
      status: "success",
    });
  }
});
//@desc Get quick order by passing quick order ID
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.getQuickOrderById = catchAsync(async (req, res, next) => {
  let { quickOrderId } = req.query;
  let foundQuickOrder = await QuickOrder.findOne({
    _id: quickOrderId,
  })
    .populate("user")
    .populate("delivery");
  res.status(200).json({
    status: "success",
    foundQuickOrder,
  });
});
//@desc Update quick order by passing quick order ID and deliveryId
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.updateQuickOrder = catchAsync(async (req, res, next) => {
  let { deliveryId, quickOrderId } = req.query;
  let quickOrder = await QuickOrder.findOne({ _id: quickOrderId });

  if (quickOrder.delivery) {
    if (deliveryId) {
      return next(new AppError("لقد حدث خطأ ما", 400));
    } else {
      handleUpdatingAndStoringElement("quickOrders", req, res, quickOrderId);
    }
  } else if (quickOrder.delivery === null) {
    req.body = { ...req.body, delivery: deliveryId };
    handleUpdatingAndStoringElement("quickOrders", req, res, quickOrderId);
  }
});
//@desc Get quick orders by passing deliveryId
//@route GET /api/v1/quickOrders/quickOrdersForDelivery
//access PUBLIC
//Note if we didnt pass deliveryId we will get all quickorders that are not assigned for delivery
exports.getQuickOrdersForDelivery = catchAsync(async (req, res, next) => {
  if (req.query.deliveryId) {
    let quickOrders = await QuickOrder.find({
      delivery: req.query.deliveryId,
    })
      .populate("delivery")
      .populate("user");
    res.status(200).json({
      status: "success",
      quickOrders,
    });
  } else {
    let quickOrders = await QuickOrder.find({
      delivery: null,
    })
      .populate("delivery")
      .populate("user");
    res.status(200).json({
      status: "success",
      quickOrders,
    });
  }
});
//@desc Get all quick orders
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.getAllQuickOrders = catchAsync(async (req, res, next) => {
  let quickOrders = await QuickOrder.find()
    .populate("user")
    .populate("delivery");

  res.status(200).json({
    status: "success",
    quickOrders,
  });
});

//@desc Delete multiple quick orders
//@route Delete /api/v1/quickOrders/
//access PUBLIC
exports.deleteMultipleQuickOrders = catchAsync(async (req, res, next) => {
  if (req.body.quickOrders.length === 0) {
    return next(new AppError(ErrorMsgs.INVALID_QUICK_ORDERS, 400));
  }
  let { quickOrders } = req.body;
  let public_ids = [];
  for (let i = 0; i < quickOrders.length; i++) {
    let foundRecord = await Record.findOne({ quickOrder: quickOrders[i] });
    if (foundRecord) {
      public_ids.push(foundRecord.public_id);
    }
  }

  //Public_ids are array of the records to be deleted => we delete through the public_id
  if (public_ids.length) {
    await cloudinary.api.delete_resources(public_ids, {
      resource_type: "video",
    });
  }

  let deletedQuickOrder = await QuickOrder.deleteMany({
    _id: {
      $in: quickOrders,
    },
  });
  res.status(200).json({
    status: "success",
    count: deletedQuickOrder.deletedCount,
  });
});

exports.getQuickOrdersForUser = catchAsync(async (req, res, next) => {
  let { userId } = req.query;

  let quickOrders = await QuickOrder.find({ user: userId }).populate(
    "delivery"
  );

  res.status(200).json({
    status: "success",
    count: quickOrders.length,
    quickOrders,
  });
});
