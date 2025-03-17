const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const errorFunction = require("../utils/errorFunction");
const handleMoveImages = require("../utils/handleMoveImages");
const logger = require("../utils/logger");

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
        reviews,
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

      const movedImages = await handleMoveImages(images, DESTINATION);

      if (existingProduct)
        return res
          .status(403)
          .json(
            errorFunction(
              true,
              "Product with same name and brand already exists!"
            )
          );

      const product = new Product({
        name,
        slug,
        brand,
        description,
        price,
        category,
        quantity,
        reviews: [],
        rating: rating || 0,
        numReviews: numReviews || 0,
        countInStock: countInStock || 0,
        discount,
        shipping: shipping === "true",
        images: movedImages,
      });

      await product.save();

      // const productResponse = product.toObject();

      // if (productResponse.image)
      // removeObjectProp(productResponse, ["images.url"]);

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
        .select("-image -createdAt -updatedAt -__v")
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
        .select("-image -createdAt -updatedAt -__v")
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
        .select("image")
        .exec();

      if (!product)
        return res.status(404).json(errorFunction(true, "No product found!"));

      if (product.image && product.image.data) {
        const imageBuffer =
          product.image.data instanceof Buffer
            ? product.image.data
            : Buffer.from(product.image.data);

        if (!Buffer.isBuffer(imageBuffer))
          return res
            .status(400)
            .json(errorFunction(true, "Image data is not a valid Buffer."));
        const contentType = product.image.contentType.split(";")[0];
        res.set("Content-type", contentType);

        return res
          .status(200)
          .json(
            errorFunction(
              false,
              "Fetched product image successfully.",
              imageBuffer
            )
          );
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

  // //update products
  updateProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        category,
        quantity,
        reviews,
        rating,
        numReviews,
        countInStock,
        shipping,
      } = req.fields;

      const slug = req.fields.slug;
      const discount = req.fields.discount;
      const image = req.fields.image;

      const products = await Product.findByIdAndUpdate(
        req.params.pid,
        {
          name,
          slug,
          brand,
          description,
          price,
          category,
          quantity,
          reviews,
          rating,
          numReviews,
          countInStock,
          discount,
          image,
          shipping: shipping === "true",
        },
        { new: true, runValidators: true }
      )
        .select("-image -__v")
        .exec();

      if (!products)
        return res.status(404).json(errorFunction(true, "No product found!"));

      await products.save();

      res
        .status(200)
        .json(errorFunction(false, "Product updated successfully.", products));
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

      const products = await Product.find(args).select("");

      if (!products)
        return res.status(404).json(errorFunction(true, "No product found!"));

      // complete this with thumbnails, (if possible store those thumbnails in g cloud or something free) and edit product response.
      // const productsWithImages = products.map(product => {
      //   if (product.image && product.image.data)
      // });

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
        .select("-image -createdAt -updatedAt -__v")
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
      }).select("-image -createdAt -updatedAt -__v");

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
        .select("-image -createdAt -updatedAt -__v")
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
        .select("-image -createdAt -updatedAt -__v") // remove image form here after the thumbnail generation part done
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
