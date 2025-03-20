const express = require("express");
const OrderController = require("../controllers/orderController");
const { isAdmin } = require("../middlewares/authMiddleware");
const checkAuth = require("../middlewares/checkAuth.middleware");
const orderStatusUpdateValidation = require("../middlewares/validationMiddlewares/order.validation.middleware/order.validation.middleware");

const router = express.Router();

router.get("/", checkAuth, OrderController.getOrdersByCustomer);

router.get("/all-orders", checkAuth, isAdmin, OrderController.getAllOrders);

router.patch(
  "/status/:orderId",
  checkAuth,
  isAdmin,
  orderStatusUpdateValidation,
  OrderController.updateOrderStatus
);

module.exports = router;
