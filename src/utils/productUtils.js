const Product = require("../models/productModel");

const updateProductWithReview = async (productId, review) => {
  const productDoc = await Product.findById(productId)
    .select("-image -__v")
    .exec();

  if (!productDoc) throw new Error("Product not found for update with review!");

  productDoc.reviews.push(review._id);
  productDoc.numReviews += 1;

  if (productDoc.rating.length > 0) {
    const totalRating = productDoc.reviews.reduce((acc, review) => {
      if (review.rating && typeof review.rating === "number")
        acc + review.rating;
      else return acc;
    }, 0);

    productDoc.rating = totalRating / productDoc.numReviews;
  } else productDoc.rating = 0;

  productDoc.newFlag = false;

  await productDoc.save();
};

module.exports = updateProductWithReview;
