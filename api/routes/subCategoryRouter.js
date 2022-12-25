const express = require("express");
const router = express.Router(); //We created sub application for categories
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesForShop,
  deleteSubCategoryById,
  updateSubCategoryById,
} = require("../controllers/subCategoryController");
const {
  checkForIdExistenceAndValiditySubCategory,
  checkForIdExistenceAndValidityShop,
} = require("../utils/checkForId");

router
  .route("/subCategory")
  .post(checkForIdExistenceAndValidityShop, createSubCategory)
  .delete(checkForIdExistenceAndValiditySubCategory, deleteSubCategoryById)
  .patch(checkForIdExistenceAndValiditySubCategory, updateSubCategoryById);

router.route("/").get(getAllSubCategories);
router
  .route("/shopSubCategories")
  .get(checkForIdExistenceAndValidityShop, getSubCategoriesForShop);

module.exports = router;
