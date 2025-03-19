const express = require("express");
const OrderController = require("../controllers/orderController");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");
const orderStatusUpdateValidation = require("../middlewares/validationMiddlewares/order.validation.middleware/order.validation.middleware");

const router = express.Router();

router.get("/", requireSignIn, OrderController.getOrdersByCustomer);

router.get("/all-orders", requireSignIn, isAdmin, OrderController.getAllOrders);

router.patch(
  "/status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusUpdateValidation,
  OrderController.updateOrderStatus
);

module.exports = router;
