const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");
const checkAuth = require("../middlewares/checkAuth.middleware");

const router = express.Router();

router.route("/getAllUsers").get(checkAuth, isAdmin, getAllUsers);

module.exports = router;
