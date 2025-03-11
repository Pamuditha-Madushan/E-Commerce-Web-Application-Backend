const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/getAllUsers").get(requireSignIn, isAdmin, getAllUsers);

module.exports = router;
