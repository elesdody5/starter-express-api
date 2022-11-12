const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const QuickOrder = require("./../models/quickOrderModel");
const catchAsync = require("../utils/catchAsync");
const ErrorMsgs = require("./../utils/ErrorMsgsConstants");
const Record = require("../models/recordModel");
const cloudinary = require("../utils/cloudinaryConfiguration");
const {
  sendMultipleNotification,
  sendNotification,
} = require("../utils/sendNotification");
const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require("../utils/firebaseStorage");
const { arrayBuffer } = require("stream/consumers");
const { join } = require("path");

// handleSend = () => {
//   const users = await User.find({ userType: "delivery" });
//     const userRegistrationTokens = users
//       .map((user) => user.notificationToken)
//       .filter((token) => token);
//     // Will be sent to all the delivery in the system
//     const message = {
//       data: {
//         userType: req.query.userType,
//         type: "quickOrder",
//       },
//       topic: "users",
//     };
//     if (userRegistrationTokens.length > 0) {
//       sendMultipleNotification(userRegistrationTokens, message, "users", res);
//     }
// }

//@desc Add quick order and notify all delivery boys
//@route POST /api/v1/quickOrders/
//access PUBLIC
//NOTE we pass here the user who made the quick order in the body of the req.
exports.addQuickOrder = catchAsync(async (req, res, next) => {
  // let quickOrder = await QuickOrder.create(req.body);
  // handleStoringImageAndCreatingElement("quickOrders", req, res);

  if (!req.file) {
    let createdElement = await QuickOrder.create(req.body);

    // handleSendingQuickOrderNotifications(req, res);

    const users = await User.find({ userType: "delivery" });
    const userRegistrationTokens = users
      .map((user) => user.notificationToken)
      .filter((token) => token);
    // Will be sent to all the delivery in the system
    const message = {
      data: {
        userType: String(req.query.userType),
        type: "quickOrder",
      },
      // topic: "users",
    };
    if (userRegistrationTokens.length > 0) {
      for (let i = 0; i < userRegistrationTokens.length; i++) {
        await sendNotification(userRegistrationTokens[i], message);
      }
      // sendMultipleNotification(userRegistrationTokens, message, "users", res);
    }

    res.status(200).json({
      status: "success",
      createdElement,
    });
  } else {
    const blob = bucket.file(`${schemaType}/${req.file.originalname}`);
    const blobStream = blob.createWriteStream();
    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
    });
    let photoUrl = `https://storage.googleapis.com/${bucket.name}/${schemaType}/${req.file.originalname}`;
    let wholeBody = { ...req.body, photo: photoUrl };
    let createdElement = await QuickOrder.create(wholeBody);

    const users = await User.find({ userType: "delivery" });
    const userRegistrationTokens = users
      .map((user) => user.notificationToken)
      .filter((token) => token);
    // Will be sent to all the delivery in the system
    const message = {
      data: {
        userType: String(req.query.userType) || "",
        type: "quickOrder",
      },
      // topic: "users",
    };
    if (userRegistrationTokens.length > 0) {
      for (let i = 0; i < userRegistrationTokens.length; i++) {
        await sendNotification(userRegistrationTokens[i], message);
      }
      // sendMultipleNotification(userRegistrationTokens, message, "users", res);
    }

    res.status(200).json({
      status: "success",
      createdElement,
    });
    blobStream.end(req.file.buffer);
  }
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
  let data;

  let foundRecord = await Record.findOne({ quickOrder: quickOrderId });

  if (foundRecord) {
    data = {
      ...foundQuickOrder._doc,
      audio: foundRecord.audio,
    };
    res.status(200).json({
      status: "success",
      data,
    });
  } else {
    res.status(200).json({
      status: "success",
      foundQuickOrder,
    });
  }
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

    let quickOrderIds = quickOrders.map((quickOrder) => quickOrder._id);
    let foundRecords = await Record.find({
      quickOrder: {
        $in: quickOrderIds,
      },
    });

    let data = [];
    if (foundRecords.length === 0) {
      res.status(200).json({
        status: "success",
        data: quickOrders,
      });
    } else {
      quickOrders.map((quickOrder) => {
        foundRecords.forEach((foundRecord) => {
          if (String(quickOrder._id) === String(foundRecord.quickOrder)) {
            data.push({ ...quickOrder._doc, audio: foundRecord.audio });
          } else {
            data.push({ ...quickOrder._doc });
          }
        });
      });
      const uniqueElements = [];
      let filteredData = data.filter((element) => {
        const isDuplicate = uniqueElements.includes(element._id);

        if (!isDuplicate) {
          uniqueElements.push(element._id);

          return true;
        }

        return false;
      });

      res.status(200).json({
        status: "success",
        data: filteredData,
      });
    }
  } else {
    let quickOrders = await QuickOrder.find({
      delivery: null,
    })
      .populate("delivery")
      .populate("user");
    let quickOrderIds = quickOrders.map((quickOrder) => quickOrder._id);
    let foundRecords = await Record.find({
      quickOrder: {
        $in: quickOrderIds,
      },
    });

    let data = [];

    if (foundRecords.length === 0) {
      res.status(200).json({
        status: "success",
        data: quickOrders,
      });
    } else {
      quickOrders.map((quickOrder) => {
        foundRecords.forEach((foundRecord) => {
          if (String(quickOrder._id) === String(foundRecord.quickOrder)) {
            data.push({ ...quickOrder._doc, audio: foundRecord.audio });
          } else {
            data.push({ ...quickOrder._doc });
          }
        });
      });

      res.status(200).json({
        status: "success",
        data,
      });
    }
  }
});
//@desc Get all quick orders
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.getAllQuickOrders = catchAsync(async (req, res, next) => {
  let quickOrders = await QuickOrder.find()
    .populate("user")
    .populate("delivery");

  let quickOrderIds = quickOrders.map((quickOrder) => quickOrder._id);
  let mySet = new Set();
  let foundRecords = await Record.find({
    quickOrder: {
      $in: quickOrderIds,
    },
  });
  let data = [];
  if (foundRecords.length === 0) {
    res.status(200).json({
      status: "success",
      data: quickOrders,
    });
  } else {
    quickOrders.map((quickOrder) => {
      foundRecords.forEach((foundRecord) => {
        if (String(quickOrder._id) === String(foundRecord.quickOrder)) {
          data.push({ ...quickOrder._doc, audio: foundRecord.audio });
        } else {
          data.push({ ...quickOrder._doc });
        }
      });
    });
    const uniqueElements = [];
    let filteredData = data.filter((element) => {
      const isDuplicate = uniqueElements.includes(element._id);

      if (!isDuplicate) {
        uniqueElements.push(element._id);

        return true;
      }

      return false;
    });
    res.status(200).json({
      status: "success",
      data: filteredData,
    });
  }
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
  let quickOrderIds = quickOrders.map((quickOrder) => quickOrder._id);

  let foundRecords = await Record.find({
    quickOrder: {
      $in: quickOrderIds,
    },
  });

  let data = [];

  if (foundRecords.length === 0) {
    res.status(200).json({
      status: "success",
      count: quickOrders.length,
      data: quickOrders,
    });
  } else {
    //Matching the Audio URL from record schema to the correlated quickorder
    quickOrders.map((quickOrder) => {
      foundRecords.forEach((foundRecord) => {
        if (String(quickOrder._id) === String(foundRecord.quickOrder)) {
          data.push({ ...quickOrder._doc, audio: foundRecord.audio });
        } else {
          data.push({ ...quickOrder._doc });
        }
      });
    });
    res.status(200).json({
      status: "success",
      count: quickOrders.length,
      data,
    });
  }
});
