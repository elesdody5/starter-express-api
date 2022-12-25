const catchAsync = require('../utils/catchAsync');
const Offer = require('../models/offerModel');
const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require('../utils/firebaseStorage');

//@desc Create an offer
//@route Create /api/v1/offers/offer
//access PUBLIC
exports.createOffer = catchAsync(async (req, res, next) => {
  req.body.shop = req.query.shopId;
  handleStoringImageAndCreatingElement('offers', req, res);
});

//@desc Delete an offer by id
//@route DELETE /api/v1/offers/offer
//access PUBLIC
exports.deleteOfferById = catchAsync(async (req, res, next) => {
  let { offerId } = req.query;

  let deletedOffer = await Offer.findOneAndDelete({ _id: offerId });

  res.status(200).json({
    status: 'success',
    deletedOffer,
  });
});
//@desc get all offers for specific shop
//@route GET /api/v1/offers/shopOffers ==> pass an id for shop
//access PUBLIC
exports.getOffersForShop = catchAsync(async (req, res, next) => {
  let { shopId } = req.query;
  let offers = await Offer.find({ shop: shopId });
  res.status(200).json({
    status: 'success',
    offers,
  });
});

//@desc Update an offer by id
//@route UPDATE /api/v1/offers/offer
//access PUBLIC
exports.updateOfferById = catchAsync(async (req, res, next) => {
  let { offerId } = req.query;
  handleUpdatingAndStoringElement('offers', req, res, offerId);
});

//@desc Get all offers
//@route GET /api/v1/offers/
//access PUBLIC
exports.getAllOffers = catchAsync(async (req, res, next) => {
  let offers = await Offer.find();
  res.status(200).json({
    status: 'success',
    offers,
  });
});
