const { format } = require("util");
const catchAsync = require("./catchAsync");
const Category = require("../models/categoryModel");
const Offer = require("../models/offerModel");
const Shop = require("../models/shopModel");
const Service = require("../models/serviceModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const QuickOrder = require("../models/quickOrderModel");
// const { bucket } = require('./firebaseConfiguration');
const { sendMultipleNotification } = require("./sendNotification");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "delivery-app-5e621",
  keyFilename: "delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json",
});
let bucket = storage.bucket("gs://delivery-app-5e621.appspot.com");

const handleSendingQuickOrderNotifications = async (req, res) => {
  const users = await User.find({ userType: "delivery" });
  const userRegistrationTokens = users
    .map((user) => user.notificationToken)
    .filter((token) => token);
  // Will be sent to all the delivery in the system
  const message = {
    data: {
      userType: req.query.userType,
      type: "quickOrder",
    },
    topic: "users",
  };
  if (userRegistrationTokens.length > 0) {
    sendMultipleNotification(userRegistrationTokens, message, "users", res);
  }
};

exports.handleStoringImageAndCreatingElement = catchAsync(
  async (schemaType, req, res) => {
    let Model;
    switch (schemaType) {
      case "categories":
        Model = Category;
        break;
      case "offers":
        Model = Offer;
        break;
      case "products":
        Model = Product;
        break;
      case "shops":
        Model = Shop;
        break;
      case "services":
        Model = Service;
        break;
      case "quickOrders":
        Model = QuickOrder;
        break;
    }

    if (!req.file) {
      let createdElement = await Model.create(req.body);
      if (Model === QuickOrder) {
        handleSendingQuickOrderNotifications(req, res);
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
      let createdElement = await Model.create(wholeBody);
      if (Model === QuickOrder) {
        handleSendingQuickOrderNotifications(req, res);
      }
      res.status(200).json({
        status: "success",
        createdElement,
      });
      blobStream.end(req.file.buffer);
    }
  }
);
exports.handleUpdatingAndStoringElement = catchAsync(
  async (schemaType, req, res) => {
    let Model;

    switch (schemaType) {
      case "categories":
        Model = Category;
        break;
      case "offers":
        Model = Offer;
        break;
      case "products":
        Model = Product;
        break;
      case "shops":
        Model = Shop;
        break;
      case "services":
        Model = Service;
        break;
      case "users":
        Model = User;
        break;
      case "quickOrders":
        Model = QuickOrder;
        break;
    }
    let id =
      Model === Category
        ? req.query.categoryId
        : Model === Offer
        ? req.query.offerId
        : Model === Product
        ? req.query.productId
        : Model === Shop
        ? req.query.shopId
        : Model === Service
        ? req.query.serviceId
        : Model === User
        ? req.query.userId
        : Model === QuickOrder
        ? req.query.quickOrderId
        : (id = id);
    if (!req.file) {
      let updatedElement = await Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        updatedElement,
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

      let updatedElement = await Model.findOneAndUpdate(
        { _id: id },
        wholeBody,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        updatedElement,
      });
      blobStream.end(req.file.buffer);
    }
  }
);
