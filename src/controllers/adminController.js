const User = require("../models/userModel");
const errorFunction = require("../utils/errorFunction");
const logger = require("../utils/logger");

const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      ...keyword,
      _id: { $ne: req.user._id },
    })
      .select("-password -lastPasswordChange -answer -__v")
      .lean(true);

    if (!users)
      return res.status(204).json(errorFunction(true, "No users found!"));

    res
      .status(200)
      .json(errorFunction(false, "Fetch all users successfully.", users));
  } catch (error) {
    logger.error("Error while trying to fetch users due to: ", error);
    return res
      .status(500)
      .json(
        errorFunction(
          true,
          `Internal Server Error in [getAllUsers] ${error.message}`
        )
      );
  }
};

module.exports = {
  getAllUsers,
};
