const express = require("express");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");
const CategoryController = require("../controllers/categoryController");
const categoryValidation = require("../middlewares/validationMiddlewares/category.routes.validation.middlewares/category.validation.middleware");
const categoryUpdateValidation = require("../middlewares/validationMiddlewares/category.routes.validation.middlewares/category.update.validation.middleware");
const categorySlugValidation = require("../middlewares/validationMiddlewares/slug.validation.middleware");
const searchKeywordValidation = require("../middlewares/validationMiddlewares/search.keyword.validation.middleware");
const categoryIdParamsValidation = require("../middlewares/validationMiddlewares/category.routes.validation.middlewares/categoryId.params.validation.middleware");

const router = express.Router();

router.post(
  "/add-category",
  categoryValidation,
  requireSignIn,
  isAdmin,
  CategoryController.createCategory
);

router.get("/", searchKeywordValidation, CategoryController.getAllCategories);

router.put(
  "/update-category/:id",
  categoryUpdateValidation,
  requireSignIn,
  isAdmin,
  CategoryController.updateCategory
);

router.get(
  "/single-category/:slug",
  categorySlugValidation,
  CategoryController.getSingleCategory
);

router.delete(
  "/delete-category/:id",
  categoryIdParamsValidation,
  requireSignIn,
  isAdmin,
  CategoryController.deleteCategory
);

module.exports = router;
