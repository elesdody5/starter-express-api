const express = require("express");
const router = express.Router(); //We created sub application for products
const { protect } = require("./../controllers/authController");
const { uploadPhoto, resizePhoto } = require("../utils/multerConfiguration");

const {
  createProduct,
  updateProductById,
  getProductById,
  deleteProductById,
  getProductsForAShop,
  getAllProducts,
} = require("../controllers/productController");

const {
  checkForIdExistenceAndValidityProduct,
  checkForIdExistenceAndValidityShop,
  checkForIdExistenceAndValiditySubCategory,
} = require("../utils/checkForId");

router
  .route("/product")
  .patch(
    checkForIdExistenceAndValidityProduct,
    uploadPhoto,
    resizePhoto,
    updateProductById
  )
  .delete(checkForIdExistenceAndValidityProduct, deleteProductById)
  .get(checkForIdExistenceAndValidityProduct, getProductById) // Get product by id
  .post(
    // Add product by adding shopId for it and the subcategory(DRINK or anything..)
    checkForIdExistenceAndValidityShop,
    checkForIdExistenceAndValiditySubCategory,
    uploadPhoto,
    resizePhoto,
    createProduct
  );

router
  .route("/productsForShop")
  .get(checkForIdExistenceAndValidityShop, getProductsForAShop);
router.route("/:shopId/:subCategoryId");

router.route("/").get(getAllProducts);

module.exports = router;
