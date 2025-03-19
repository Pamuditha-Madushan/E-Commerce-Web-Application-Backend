const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const errorFunction = require("../utils/errorFunction");
const handleMoveImages = require("../utils/handleMoveImages");
const logger = require("../utils/logger");
const getImageData = require("../services/imageService");
const storageService = require("../services/storageService");

const DESTINATION = process.env.GCS_DESTINATION_FOLDER_PATH;

const ProductController = {
  createProduct: async (req, res) => {
    try {
      const {
        name,
        brand,
        description,
        price,
        category,
        quantity,
        rating,
        numReviews,
        countInStock,
        shipping,
      } = req.fields;

      const slug = req.fields.slug;
      const discount = req.fields.discount;
      const images = req.fields.images;

      const existingProduct = await Product.findOne({
        $or: [{ $and: [{ name }, { brand }] }, { slug }],
      }).lean(true);

      if (existingProduct)
        return res
          .status(403)
          .json(
            errorFunction(
              true,
              "Product with same name and brand already exists!"
            )
          );

      const reviews = [];
      const movedImages = await handleMoveImages(images, DESTINATION);

      const product = new Product({
        name,
        slug,
        brand,
        description,
        price,
        category,
        quantity,
        reviews,
        rating: rating || 0,
        numReviews: numReviews || 0,
        countInStock: countInStock || 0,
        discount,
        shipping: shipping === "true",
        images: movedImages,
      });

      await product.save();

      res
        .status(201)
        .json(errorFunction(false, "Product created successfully.", product));
    } catch (error) {
      logger.error("Error while creating the product. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to: ${error.message}`)
        );
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({})
        .populate("category")
        .select("-images.publicId -createdAt -updatedAt -__v")
        .limit(12)
        .sort({ createdAt: -1 });

      if (!products)
        return res.status(404).json(errorFunction(true, "No products found!"));

      res.status(200).json(
        errorFunction(false, "Fetched all products successfully.", {
          totalCount: products.length,
          products,
        })
      );
    } catch (error) {
      logger.error("Error while in getting all products. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findOne({ slug: req.params.slug })
        .select("-createdAt -updatedAt -__v")
        .populate("category", "-__v")
        .lean(true);

      if (!product)
        return res.status(404).json(errorFunction(true, "No product found!"));

      res
        .status(200)
        .json(errorFunction(false, "Fetched a product successfully.", product));
    } catch (error) {
      logger.error("Error while getting single product.", error);

      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getProductImage: async (req, res) => {
    try {
      const product = await Product.findById(req.params.pid)
        .select("images")
        .exec();

      if (!product)
        return res.status(404).json(errorFunction(true, "No product found!"));

      if (product.images && product.images.length > 0) {
        const imagePreview = product.images[0];
        const imageUrl = imagePreview.url;

        try {
          const { imageBuffer, contentType } = await getImageData(imageUrl);

          res.setHeader("Content-Type", contentType);
          return res.status(200).send(
            errorFunction(false, "Fetched product image successfully.", {
              imageBuffer,
            })
          );
        } catch (error) {
          if (
            error.message ===
            "Unsupported image format. Only JPEG and PNG are allowed."
          )
            return res.status(400).json(true, error.message);
          else if (error.message === "Image not found in the storage.")
            return res.status(404).json(true, error.message);
          else throw error;
        }
      } else {
        return res
          .status(404)
          .json(errorFunction(true, "Product does not have an image."));
      }
    } catch (error) {
      logger.error("Error while getting the image. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await Product.findByIdAndDelete(pid)
        .select("-image")
        .exec();

      if (!product)
        return res.status(404).json(errorFunction(true, "No product found!"));

      res
        .status(200)
        .send(
          errorFunction(false, `Product of ID ${pid} Deleted successfully.`)
        );
    } catch (error) {
      logger.error("Error while deleting the product. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.pid;
      const {
        name,
        brand,
        description,
        price,
        category,
        quantity,
        rating,
        numReviews,
        countInStock,
        shipping,
      } = req.fields;

      const slug = req.fields.slug;
      const discount = req.fields.discount;
      const images = req.fields.images;

      const product = await Product.findById(productId).exec();

      if (!product)
        return res.status(404).json(errorFunction(true, "No product found!"));

      if (product.name === name && product.brand === brand)
        return res
          .status(400)
          .json(
            errorFunction(
              true,
              "The entered name and brand cannot be the same as an existing name and brand!"
            )
          );

      const { filesToRemove, filesToUpload } = storageService.compareFile(
        product.images ? product.images : [],
        images ? images : []
      );

      const movedImages = images
        ? await handleMoveImages(images, DESTINATION)
        : [];

      try {
        const result = await Product.updateOne(
          { _id: productId },
          {
            $set: {
              name,
              slug,
              brand,
              description,
              price,
              category,
              quantity,
              rating,
              numReviews,
              countInStock,
              discount,
              images: movedImages,
              shipping: shipping === "true",
            },
          },
          { new: true, runValidators: true }
        )
          .select("-__v")
          .exec();

        if (!result)
          return res
            .status(400)
            .json(errorFunction(true, "Product update failed!"));

        const deletePromises = filesToRemove
          ? filesToRemove.map(async (file) => {
              return await storageService.deleteFile(
                `${DESTINATION}/${file.publicId}`
              );
            })
          : [];

        await Promise.all(deletePromises);

        res
          .status(200)
          .json(errorFunction(false, "Product updated successfully.", result));
      } catch (err) {
        const rollbackPromises = images
          ? images.map(async (image) => {
              return await storageService.deleteFile(image.publicId);
            })
          : [];
        await Promise.all(rollbackPromises);
        throw err;
      }
    } catch (error) {
      logger.error("Error while updating the product. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  filterProducts: async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};

      if (checked && checked.length > 0) {
        const categories = await Category.find({
          name: { $in: checked },
        }).select("_id");

        if (categories.length === 0)
          return res
            .status(400)
            .json(
              errorFunction(
                true,
                "No matching categories found. Please check the category names and try again."
              )
            );

        const categoryId = categories.map((category) => category._id);
        args.category = { $in: categoryId };
      }
      if (radio && radio.length)
        args.price = { $gte: radio[0], $lte: radio[1] };

      const products = await Product.find(args).select(
        "-createdAt -updatedAt -__v"
      );

      if (!products)
        return res.status(404).json(errorFunction(true, "No product found!"));

      res
        .status(200)
        .json(
          errorFunction(false, "Filtered products successfully.", products)
        );
    } catch (error) {
      logger.error("Error while filtering the products. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  countProducts: async (req, res) => {
    try {
      const total = await Product.find({}).estimatedDocumentCount();

      if (!total)
        return res.status(404).json(errorFunction(true, "No product found!"));

      res.status(200).json(
        errorFunction(false, "Count products successfully.", {
          "Total products count": total,
        })
      );
    } catch (error) {
      logger.error("Error while counting products. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getProductsList: async (req, res) => {
    try {
      const productsPerPage = 6;
      const page = req.params.page ? req.params.page : 1;

      const products = await Product.find({})
        .select("-createdAt -updatedAt -__v")
        .skip((page - 1) * productsPerPage)
        .limit(productsPerPage)
        .sort({ createdAt: -1 });

      if (products.length === 0)
        return res
          .status(404)
          .json(errorFunction(true, "No product found for this page!"));

      res
        .status(200)
        .json(
          errorFunction(
            false,
            `Product list for page: ${page} fetched successfully.`,
            products
          )
        );
    } catch (error) {
      logger.error("Error while getting products list. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getSearchedProduct: async (req, res) => {
    try {
      let keyword =
        req.query.searchKeyword && req.query.searchKeyword.trim() !== ""
          ? {
              $or: [
                {
                  name: {
                    $regex: `.*${req.query.searchKeyword.trim()}*.`,
                    $options: "i",
                  },
                },
                {
                  description: {
                    $regex: `.*${req.query.searchKeyword.trim()}*.`,
                    $options: "i",
                  },
                },
              ],
            }
          : {};

      const products = await Product.find({
        ...keyword,
      }).select("-createdAt -updatedAt -__v");

      if (products.length === 0)
        return res
          .status(404)
          .json(
            errorFunction(
              true,
              "No products found for the entered search keyword!"
            )
          );

      res
        .status(200)
        .json(
          errorFunction(false, "Fetched the products successfully.", products)
        );
    } catch (error) {
      logger.error("Error while searching the product.", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getRelatedProducts: async (req, res) => {
    try {
      const { slug, pid } = req.params;

      const category = await Category.findOne({ slug }).lean(true);

      if (!category)
        return res
          .status(404)
          .json(errorFunction(true, "No matching category found!"));

      const products = await Product.find({
        category: category._id,
        _id: { $ne: pid },
      })
        .select("-createdAt -updatedAt -__v")
        .limit(3)
        .populate("category", "-__v")
        .lean(true);

      if (products.length === 0)
        return res
          .status(404)
          .json(errorFunction(true, "No matching products found!"));

      res
        .status(200)
        .json(
          errorFunction(
            false,
            "Fetched related products successfully.",
            products
          )
        );
    } catch (error) {
      logger.error("Error while getting the related product. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const category = await Category.findOne({ slug: req.params.slug }).lean(
        true
      );

      if (!category)
        return res.status(404).json(errorFunction(true, "No category found!"));

      const products = await Product.find({ category })
        .select("-createdAt -updatedAt -__v") // remove image form here after the thumbnail generation part done
        .populate("category", "-__v")
        .lean(true);

      if (products.length === 0) {
        return res.status(404).json(errorFunction(true, "No products found!"));
      }

      res
        .status(200)
        .json(
          errorFunction(
            false,
            "Fetched products according to category successfully.",
            products
          )
        );
    } catch (error) {
      logger.error(
        "Error while getting the products according to category. ",
        error
      );
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },
};

module.exports = ProductController;
