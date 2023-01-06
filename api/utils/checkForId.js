//This file contains for middleware functions to check for ID length and ID exsitence for neccessary routes

const AppError = require('./appError');
const ErrorMsgs = require('./ErrorMsgsConstants');
exports.checkForIdExistenceAndValidityProduct = (req, res, next) => {
  if (!req.query.productId) {
    return next(new AppError(ErrorMsgs.NO_PRODUCT_ID, 400));
  } else if (req.query.productId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_PRODUCT_ID, 400));
  }
  next();
};

exports.checkForIdExistenceAndValidityShop = (req, res, next) => {
  if (!req.query.shopId) {
    return next(new AppError(ErrorMsgs.NO_SHOP_ID, 400));
  } else if (req.query.shopId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_SHOPID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValidityCategory = (req, res, next) => {
  if (!req.query.categoryId) {
    return next(new AppError(ErrorMsgs.NO_CATEGORY_ID, 400));
  } else if (req.query.categoryId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_CATEGORY_ID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValiditySubCategory = (req, res, next) => {
  if (!req.query.subCategoryId) {
    return next(new AppError(ErrorMsgs.NO_SUBCATEGORY_ID, 400));
  } else if (req.query.subCategoryId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_SUBCATEGORY_ID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValidityOffer = (req, res, next) => {
  if (!req.query.offerId) {
    return next(new AppError(ErrorMsgs.NO_OFFER_ID, 400));
  } else if (req.query.offerId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_OFFER_ID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValidityService = (req, res, next) => {
  if (!req.query.serviceId) {
    return next(new AppError(ErrorMsgs.NO_SERVICE_ID, 400));
  } else if (req.query.serviceId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_SERVICE_ID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValidityUser = (req, res, next) => {
  if (!req.query.userId) {
    return next(new AppError(ErrorMsgs.NO_USER_ID, 400));
  } else if (req.query.userId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_USER_ID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValidityOrder = (req, res, next) => {
  if (!req.query.orderId) {
    return next(new AppError(ErrorMsgs.NO_ORDER_ID, 400));
  } else if (req.query.orderId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_ORDER_ID, 400));
  }
  next();
};
exports.checkForIdExistenceAndValidityQuickOrder = (req, res, next) => {
  if (!req.query.quickOrderId) {
    return next(new AppError(ErrorMsgs.NO_ORDER_ID, 400));
  } else if (req.query.quickOrderId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_ORDER_ID, 400));
  }
  next();
};
