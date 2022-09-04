const catchAsync = require("../utils/catchAsync");
const Category = require("../models/categoryModel");

const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require("../utils/firebaseStorage");

//@desc Create a category(Represents if the Shop in the food category or anything else etc...)
//@route POST /api/v1/category/
//access PUBLIC
exports.createCategory = catchAsync(async (req, res, next) => {
  handleStoringImageAndCreatingElement("categories", req, res);
});

//@desc Get all categories
//@route POST /api/v1/category/
//access PUBLIC
exports.getAllCategories = catchAsync(async (req, res, next) => {
  let categories = await Category.find({});
  res.status(200).json({
    status: "success",
    categories,
  });
});

//@desc Delete a category by id
//@route DELETE /api/v1/categories/category
//access PUBLIC
exports.deleteCategoryById = catchAsync(async (req, res, next) => {
  let { categoryId } = req.query;

  let deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

  res.status(200).json({
    status: "success",
    deletedCategory,
  });
});

//@desc Update a category by id
//@route Update /api/v1/categories/category
//access PUBLIC
exports.updateCategoryById = catchAsync(async (req, res, next) => {
  let { categoryId } = req.query;

  handleUpdatingAndStoringElement("categories", req, res, categoryId);
});

//@desc Get a category by id
//@route Get /api/v1/categories/category
//access PUBLIC

exports.getCategoryById = catchAsync(async (req, res, next) => {
  let { categoryId } = req.query;
  let category = await Category.findById({
    _id: categoryId,
  });
  res.status(200).json({
    status: "success",
    category,
  });
});
