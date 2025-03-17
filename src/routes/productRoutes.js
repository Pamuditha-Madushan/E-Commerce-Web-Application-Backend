const express = require("express");
const formidable = require("express-formidable");
const ProductController = require("../controllers/productController");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");
const checkCorrectFormat = require("../middlewares/check.correct.data.source.format.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const productValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/product.validation.middleware");
const slugValidation = require("../middlewares/validationMiddlewares/slug.validation.middleware");
const productIdParamsValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/productId.params.validation.middleware");
const filterProductsValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/product.filter.validation.middleware");
const searchKeywordValidation = require("../middlewares/validationMiddlewares/search.keyword.validation.middleware");
const pageValidation = require("../middlewares/validationMiddlewares/page.params.validation.middleware");

const router = express.Router();

router.post(
  "/create",
  requireSignIn,
  isAdmin,
  checkCorrectFormat,
  // formidable(),
  uploadMiddleware,
  productValidation,
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

// commented temporarily
// router.post(
//   "/filter",
//   filterProductsValidation,
//   ProductController.filterProducts
// );

router.get("/count", requireSignIn, isAdmin, ProductController.countProducts);

router.get(
  "/search",
  searchKeywordValidation,
  ProductController.getSearchedProduct
);

router.get("/:slug", slugValidation, ProductController.getProduct);

router.get(
  "/image/:pid",
  productIdParamsValidation,
  ProductController.getProductImage
);

// //routes
// router.put(
//   "/update-product/:pid",
//   requireSignIn,
//   isAdmin,
//   formidable(),
//   updateProductController
// );

router.delete(
  "/delete/:pid",
  productIdParamsValidation,
  requireSignIn,
  isAdmin,
  ProductController.deleteProduct
);

router.get("/list/:page", pageValidation, ProductController.getProductsList);

router.get(
  "/related/:slug/:pid/",
  slugValidation,
  ProductController.getRelatedProducts
);

router.get(
  "/category/:slug",
  slugValidation,
  ProductController.getProductsByCategory
);

module.exports = router;
