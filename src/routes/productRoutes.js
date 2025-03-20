const express = require("express");
const ProductController = require("../controllers/productController");
const { isAdmin } = require("../middlewares/authMiddleware");
const checkAuth = require("../middlewares/checkAuth.middleware");
const checkCorrectFormat = require("../middlewares/check.correct.data.source.format.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const productValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/product.validation.middleware");
const slugValidation = require("../middlewares/validationMiddlewares/slug.validation.middleware");
const productIdParamsValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/productId.params.validation.middleware");
const productUpdateValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/product.update.validation.middleware");
const filterProductsValidation = require("../middlewares/validationMiddlewares/product.validation.middlewares/product.filter.validation.middleware");
const searchKeywordValidation = require("../middlewares/validationMiddlewares/search.keyword.validation.middleware");
const pageValidation = require("../middlewares/validationMiddlewares/page.params.validation.middleware");

const router = express.Router();

router.post(
  "/create",
  checkAuth,
  isAdmin,
  checkCorrectFormat,
  uploadMiddleware,
  productValidation,
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

router.post(
  "/filter",
  filterProductsValidation,
  ProductController.filterProducts
);

router.get("/count", checkAuth, isAdmin, ProductController.countProducts);

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

router.put(
  "/update/:pid",
  checkAuth,
  isAdmin,
  checkCorrectFormat,
  uploadMiddleware,
  productUpdateValidation,
  ProductController.updateProduct
);

router.delete(
  "/delete/:pid",
  checkAuth,
  isAdmin,
  productIdParamsValidation,
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
