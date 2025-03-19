const Order = require("../models/orderModel");
const errorFunction = require("../utils/errorFunction");
const logger = require("../utils/logger");

const OrderController = {
  getOrdersByCustomer: async (req, res) => {
    try {
      const orders = await Order.find({ buyer: req.user._id })
        .select("-createdAt -updatedAt -__v")
        .populate(
          "products",
          "-description -quantity -countInStock -reviews -numReviews -createdAt -updatedAt -__v"
        )
        .populate("buyer", "name");

      if (orders.length === 0)
        return res
          .status(404)
          .json(
            errorFunction(
              true,
              `No orders for the customer of User ID: ${req.user._id} found!`
            )
          );
      res
        .status(200)
        .json(
          errorFunction(
            false,
            "Fetched orders according to customer successfully.",
            orders
          )
        );
    } catch (error) {
      logger.error("Error while getting orders according to customer. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find({})
        .select("-createdAt -updatedAt -__v")
        .populate(
          "products",
          "-description -quantity -countInStock -reviews -numReviews -createdAt -updatedAt -__v"
        )
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });

      if (orders.length === 0)
        return res.status(404).json(errorFunction(true, "No orders found!"));

      res
        .status(200)
        .json(errorFunction(false, "Fetched all orders successfully.", orders));
    } catch (error) {
      logger.error("Error while getting all orders. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: { status } },
        { new: true, runValidators: true }
      ).select("-createdAt -updatedAt -__v");

      if (!order)
        return res.status(404).json(errorFunction(true, "No order found!"));

      res
        .status(200)
        .json(
          errorFunction(false, "Order status updated successfully.", order)
        );
    } catch (error) {
      logger.error("Error while updating order status. ", error);
      return res
        .status(500)
        .json(
          errorFunction(true, `Internal Server Error due to : ${error.message}`)
        );
    }
  },
};

module.exports = OrderController;
