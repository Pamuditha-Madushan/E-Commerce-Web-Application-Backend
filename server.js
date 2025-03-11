const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("./src/config/passport.oauth");
require("colors");
require("./src/config/cron");
const connectDB = require("./src/config/db");
const sessionConfig = require("./src/config/session");
const formidableMiddleware = require("express-formidable");
const loggingMiddleware = require("./src/middlewares/loggingMiddleware");
const logger = require("./src/utils/logger");
// const defaultRoutes = require("./src/routes/defaultRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
// const orderRoutes = require("./src/routes/orderRoutes");
const gracefulShutdown = require("./src/services/gracefulShutdown");

connectDB();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(session(sessionConfig));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET_KEY || "cats",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

app.use(loggingMiddleware);

// app.use(formidableMiddleware());

app.use("/", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
// app.use("/api/v1/order", orderRoutes);

// app.use("/", defaultRoutes);

const port = process.env.PORT || 3333;

let listenServer;

mongoose.connection.once("open", () => {
  listenServer = app.listen(port, () => {
    logger.info(
      `Server is running ${process.env.NODE_MODE} mode on port ${process.env.PORT} ...`
        .bgWhite.black
    );
  });
});

process.on("SIGINT", async () => {
  logger.warn("Received SIGINT, shutting down gracefully...");
  await mongoose.connection.close();
  logger.warn("MongoDB connection closed");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, ${reason}`);
  gracefulShutdown(listenServer);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}, Stack: ${err.stack}`);
  gracefulShutdown(listenServer);
});
