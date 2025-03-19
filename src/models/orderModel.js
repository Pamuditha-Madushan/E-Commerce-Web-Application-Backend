const mongoose = require("mongoose");
const Product = require("./productModel");
const { logger } = require("../config/nodemailer");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "Yet to Process",
      enum: ["Yet to Process", "Processing", "Shipped", "Delivered", "Cancel"],
    },
  },
  { timestamps: true }
);

orderSchema.post("save", async function (doc) {
  console.log("Middleware executed for order:", doc._id);
  try {
    for (const product of doc.products) {
      //  await Product.
      // await this.model("Product").    // check this works if it is remove Product import
      await this.model("Product").findByIdAndUpdate(product, {
        $inc: { countInStock: -1 },
      });
      console.log(`Updated stock for product ID: ${product}`);
    }
  } catch (error) {
    logger.error("Error updating stock:", error);
    throw error;
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
