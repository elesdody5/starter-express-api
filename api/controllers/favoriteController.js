const catchAsync = require("../utils/catchAsync");
const Favorite = require("../models/favoriteModel");
const { ObjectId } = require("mongodb");

// @desc add favorite shops for user
// @route POST /api/v1/shops/shop => pass shopIds array in the body and the userId in the query
// access PUBLIC
exports.addShopForUserInFavorites = catchAsync(async (req, res, next) => {
  req.body.user = req.query.userId;

  //Req.body.shopIds === shops needed to be favorite
  req.body.favoriteShops = [...req.body.shopIds];

  let favorite = await Favorite.create(req.body);
  res.status(200).json({
    status: "success",
    favorite,
  });
});
//@desc Get favorite shops for user ==> By providing userid in query
//@route GET /api/v1/favorites/favorite
//access PUBLIC
exports.getFavoriteShopsForUser = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  let favorite = await Favorite.findOne({ user: userId }).populate(
    "favoriteShops"
  );
  res.status(200).json({
    status: "success",
    favoriteShops: favorite.favoriteShops,
  });
});
// @desc Add favorite shops for user ==> By providing userid in query and array of favorite shops to be removed
// @route PACTCH /api/v1/favorites/favorite
// access PUBLIC
exports.addShopForFavorites = catchAsync(async (req, res, next) => {
  let { shopId, userId } = req.query;
  let favorite = await Favorite.findOne({ user: userId });
  let favoriteShops = favorite.favoriteShops;
  favoriteShops.push(shopId);

  let updatedFavorite = await Favorite.findOneAndUpdate(
    { user: req.query.userId },
    { favoriteShops },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    updatedFavorite,
  });
});

exports.removeShopFromFavorites = catchAsync(async (req, res, next) => {
  let { shopId, userId } = req.query;
  let favorite = await Favorite.findOne({ user: userId });
  let favoriteShops = favorite.favoriteShops;
  let filteredFavoriteShops = favoriteShops.filter((shop) => {
    return shopId != ObjectId(shop);
  });
  let updatedFavorite = await Favorite.findOneAndUpdate(
    { user: req.query.userId },
    { favoriteShops: filteredFavoriteShops },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    updatedFavorite,
  });
});
