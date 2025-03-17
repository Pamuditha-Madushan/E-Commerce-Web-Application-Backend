const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    newFlag: {
      type: Boolean,
      default: true,
      select: false,
    },
    discount: {
      percentage: { type: Number, default: 0, select: false },
      visible: { type: Boolean, default: false, select: false },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isNew) this.countInStock = this.quantity;

  next();
});

productSchema.pre("save", async function (next) {
  if (this.isModified("reviews")) {
    if (this.reviews.length > 0) {
      const populatedReviews = await this.model("Review").find({
        _id: { $in: this.reviews },
      });
      this.rating =
        populatedReviews.reduce((acc, review) => acc + review.rating, 0) /
        populatedReviews.length;
      this.numReviews = populatedReviews.length;
    } else {
      this.rating = 0;
      this.numReviews = 0;
    }
  }
  next();
});

productSchema.post("findOneAndUpdate", async function (doc) {
  if (doc && doc.reviews && doc.reviews.length > 0) {
    const populatedReviews = await this.model("Review").find({
      _id: { $in: this.reviews },
    });
    doc.rating =
      populatedReviews.reduce((acc, review) => acc + review.rating, 0) /
      populatedReviews.length;
    doc.numReviews = populatedReviews.length;
    doc.newFlag = false;
    await doc.save();
  } else {
    doc.rating = 0;
    doc.numReviews = 0;
    doc.newFlag = true;
    await doc.save();
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
