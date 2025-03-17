const Category = require("../models/categoryModel");
const slugify = require("slugify");
const errorFunction = require("../utils/errorFunction");
const logger = require("../utils/logger");

const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const slug = slugify(name);

      const existingCategory = await Category.findOne({
        $or: [{ name }, { slug }],
      })
        .select("-__v")
        .exec();

      if (existingCategory) {
        if (existingCategory.name === name)
          return res
            .status(403)
            .json(
              errorFunction(true, "Category with this name already exists!")
            );
        return res
          .status(403)
          .json(errorFunction(true, "Category with this slug already exists!"));
      }

      const category = await new Category({
        name,
        slug,
      }).save();

      res
        .status(201)
        .json(
          errorFunction(false, "New category created successfully.", category)
        );
    } catch (error) {
      logger.error("Error in [createCategory] ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId).exec();

      if (!category)
        return res.status(404).json(errorFunction(true, "No category found!"));

      if (category.name === name)
        return res
          .status(403)
          .json(
            errorFunction(
              true,
              "Update failed: The provided category name matches an existing category name, so updates are not allowed!"
            )
          );

      const updatedResult = await Category.findByIdAndUpdate(
        { _id: categoryId, name: { $ne: name } },
        {
          $set: {
            name,
            slug: slugify(name),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .select("-__v")
        .exec();

      res
        .status(200)
        .json(
          errorFunction(false, "Category Updated Successfully", updatedResult)
        );
    } catch (error) {
      logger.error("Error while updating category ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const keyword =
        req.query.search && req.query.search.trim() !== ""
          ? {
              $or: [{ name: { $regex: req.query.search, $options: "i" } }],
            }
          : {};
      const categories = await Category.find({
        ...keyword,
      }).select("-__v");

      if (categories.length === 0)
        return res
          .status(404)
          .json(
            errorFunction(
              true,
              "No categories found for the entered search keyword!"
            )
          );

      res
        .status(200)
        .json(
          errorFunction(
            false,
            "Fetched all categories successfully.",
            categories
          )
        );
    } catch (error) {
      logger.error("Error while getting all categories ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to: ${error.message}`)
        );
    }
  },

  getSingleCategory: async (req, res) => {
    try {
      const category = await Category.findOne({ slug: req.params.slug })
        .select("-__v")
        .lean(true);

      if (!category)
        return res.status(404).json(errorFunction(true, "No category found!"));

      res
        .status(200)
        .json(
          errorFunction(false, "Fetched a Category Successfully.", category)
        );
    } catch (error) {
      logger.error("Error while retrieving category. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to: ${error.message}`)
        );
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByIdAndDelete(id).exec();

      if (!category)
        return res.status(404).json(errorFunction(true, "No category found!"));

      res
        .status(200)
        .json(
          errorFunction(
            false,
            `Category of category ID: ${id} deleted successfully.`
          )
        );
    } catch (error) {
      logger.error("Error while deleting category. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to: ${error.message}`)
        );
    }
  },
};

module.exports = CategoryController;
