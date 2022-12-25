const AppError = require("../utils/appError");
const Shop = require("../models/shopModel");
const Product = require("../models/productModel");
const Favorite = require("../models/favoriteModel");
const subCategory = require("../models/subCategoryModel");
const Offer = require("../models/offerModel");

const { format } = require("util");
const catchAsync = require("../utils/catchAsync");
const ErrorMsgs = require("../utils/ErrorMsgsConstants");
const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require("../utils/firebaseStorage");

//@desc Create a shop(Represents any resturant etc...)
//@route POST /api/v1/shops/shop => pass category id in the query
//access PRIVATE -> You have to be logged in.

exports.createShop = catchAsync(async (req, res, next) => {
  let { phone } = req.body;

  //Take id from the currently logged in user.
  req.body.owner = req.query.userId;
  //Getting the categoryId from the query  and setting it to be in the body of the request.
  req.body.category = req.query.categoryId;

  //Checking for uniquness of phone number
  if (phone) {
    let phone = await Shop.findOne({ phone: req.body.phone });
    if (phone) {
      return next(new AppError(ErrorMsgs.DUPLICATE_PHONE, 400));
    }
  }
  handleStoringImageAndCreatingElement("shops", req, res);
});
//@desc get all shops in the system
//@route GET /api/v1/shops/
//access PUBLIC
exports.getAllShops = catchAsync(async (req, res, next) => {
  let shops = await Shop.find({}, { owner: 0 });
  res.status(200).json({
    status: "success",
    shops,
  });
});
//@desc get a specific shop
//@route GET /api/v1/shops/shop => pass shop id in query
//access PUBLIC
exports.getShopById = catchAsync(async (req, res, next) => {
  if (req.query.shopId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_SHOPID, 400));
  }

  let isFavorite = null;
  if (req.query.userId) {
    let favoriteShopsForUser = await Favorite.find({
      user: req.query.userId,
    });
    //Checking in favoriteShops array in favorite schema if the shop included for the favorite shops for the user
    isFavorite = favoriteShopsForUser[0].favoriteShops.includes(
      req.query.shopId
    );
  }
  let shop = await Shop.findById(req.query.shopId)
    .populate("owner")
    .populate("category")
    .exec();
  res.status(200).json({
    status: "success",
    shop,
    isFavorite,
  });
});
//@desc get a shops by specific categoryID
//@route GET /api/v1/shops/shopsForCategory
//access PUBLIC
exports.getShopsByCategory = catchAsync(async (req, res, next) => {
  let shops = await Shop.find({ category: req.query.categoryId })
    .populate("owner")
    .populate("category")
    .exec();
  res.status(200).json({
    status: "success",
    shops,
  });
});
//@desc Delete a shop by id
//@route DELETE /api/v1/shops/shop
//access PUBLIC
exports.deleteShopById = catchAsync(async (req, res, next) => {
  let { shopId } = req.query;

  let deletedShop = await Shop.findOneAndDelete({ _id: shopId });
  // //When deleting a shop we delete all the products related to this product
  // await Product.deleteMany({ shop: shopId });
  // //When deleting a shop we delete all the subCategories assosiated with this shop
  // await subCategory.deleteMany({ shop: shopId });
  // //When deleting a shop we delete all offers assosiated with this shop
  // await Offer.deleteMany({ shop: shopId });
  Promise.all([
    Product.deleteMany({ shop: shopId }),
    subCategory.deleteMany({ shop: shopId }),
    Offer.deleteMany({ shop: shopId }),
  ]);

  res.status(200).json({
    status: "success",
    deletedShop,
  });
});
//@desc Update a shop by id
//@route UPDATE /api/v1/shops/shop
//access PUBLIC
exports.updateShopById = catchAsync(async (req, res, next) => {
  let { shopId } = req.query;
  handleUpdatingAndStoringElement("shops", req, res, shopId);
});

//@desc Get all shops for specific owner by providing ==> userId
//@route GT /api/v1/shops/shopsForOwner
//access PUBLIC
exports.getShopsOwner = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  let shopsOwner = await Shop.find({ owner: userId });
  res.status(200).json({
    status: "success",
    shopsOwner,
  });
});
//@desc Update notificationToken ==> update token to a value provided in query or clear it if there is no value passed
//@route PATCH /api/v1/shops/notificationToken
//access PUBLIC
exports.updateNotificationToken = catchAsync(async (req, res, next) => {
  const notificationToken = req.query.notificationToken;
  let foundShop;
  if (notificationToken) {
    foundShop = await Shop.findByIdAndUpdate(
      req.query.shopId,
      { notificationToken },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    foundShop = await Shop.findByIdAndUpdate(
      req.query.shopId,
      { notificationToken: null },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  res.status(200).json({
    status: "success",
    foundShop,
  });
});
