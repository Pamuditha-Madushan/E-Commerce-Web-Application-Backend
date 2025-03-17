const JWT = require("jsonwebtoken");
const User = require("../models/userModel");
const { securePassword, comparePassword } = require("../helpers/authHelper");
const errorFunction = require("../utils/errorFunction");
const logger = require("../utils/logger");
const Verification = require("../models/verification.model");
const VerificationController = require("../controllers/verificationController");
const {
  isEmailExistsLean,
  isEmailExists,
} = require("../utils/checkEmailExists");
const removeObjectProp = require("../utils/removeObjectProp");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobileNumber, address, answer } = req.body;

    const existingUser = await isEmailExistsLean(email);

    if (existingUser)
      return res
        .status(409)
        .json(errorFunction(true, "User with provided email already exists!"));

    const securedPassword = await securePassword(password);

    const user = await new User({
      name,
      email,
      mobileNumber,
      address,
      password: securedPassword,
      answer,
      authMethod: "traditional",
    }).save();

    if (!user)
      return res.status(403).json(errorFunction(true, "Error creating user!"));

    try {
      await VerificationController.sendVerificationEmail(user, email);
    } catch (error) {
      logger.error(
        "Error while sending the verification email at user login. ",
        error
      );
      return res
        .status(500)
        .json(
          errorFunction(
            true,
            `Failed to send verification email: ${error.message}`
          )
        );
    }

    const userRegisterResponse = user.toObject();

    if (
      userRegisterResponse.password &&
      userRegisterResponse.lastPasswordChange &&
      userRegisterResponse.authMethod
    )
      removeObjectProp(userRegisterResponse, [
        "password",
        "lastPasswordChange",
        "authMethod",
      ]);

    res
      .status(201)
      .json(
        errorFunction(
          false,
          "User created successfully. Please check your email for verification.",
          userRegisterResponse
        )
      );
  } catch (error) {
    logger.error("Error while trying to register user.", error);

    if (error.code === 11000)
      return res.status(400).json(errorFunction(true, "Duplicate key error!"));

    return res
      .status(500)
      .json(errorFunction(true, `Internal server error! ${error.message}`));
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await isEmailExists(email);

    if (!user)
      return res.status(404).json(errorFunction(true, "User not found!"));

    if (user.authMethod !== "traditional")
      return res
        .status(400)
        .json(
          errorFunction(
            true,
            "Users who registered with email and password is able to login with this route!"
          )
        );

    if (!user.verified)
      return res
        .status(403)
        .json(
          errorFunction(true, "Please verify your email before logging in.")
        );

    const match = await comparePassword(password, user.password);

    if (!match)
      return res
        .status(403)
        .json(errorFunction(true, "Invalid email or password!"));

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json(
      errorFunction(false, "User logged in successfully...", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      })
    );
  } catch (error) {
    logger.error("Error while trying to logging in. ", error);
    return res
      .status(500)
      .json(errorFunction(true, `Internal server error! ${error.message}`));
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, answer, password, newPassword } = req.body;

    const user = await User.findOne({ email, answer })
      .select("+password")
      .lean(true);

    if (!user)
      return res
        .status(404)
        .json(errorFunction(true, "Invalid Email Or Answer is submitted!"));

    const matchExistingPassword = await comparePassword(
      password,
      user.password
    );

    if (!matchExistingPassword)
      return res
        .status(403)
        .json(errorFunction(true, "Invalid email or password!"));

    const matchNewPassword = await comparePassword(newPassword, user.password);

    if (matchNewPassword)
      return res
        .status(422)
        .json(
          errorFunction(
            true,
            "New password cannot be same as the old password!"
          )
        );

    const currentDate = new Date();
    const passwordChangeDate = new Date(user.lastPasswordChange);
    const differenceInTime = currentDate - passwordChangeDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 7)
      return res
        .status(403)
        .json(
          errorFunction(
            true,
            "You cannot change your password within 7 days of the last change!"
          )
        );

    const securedPassword = await securePassword(newPassword);

    const result = await User.findByIdAndUpdate(user._id, {
      password: securedPassword,
      lastPasswordChange: currentDate,
    }).exec();

    if (!result)
      return res
        .status(500)
        .json(errorFunction(true, "Error while resetting the password!"));

    res.status(201).json(errorFunction(false, "Password reset successful.."));
  } catch (error) {
    logger.error("Error while trying to reset the password. ", error);
    return res
      .status(500)
      .json(
        errorFunction(true, `Internal Server  Error due to: ${error.message}`)
      );
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, password, address, mobileNumber } = req.body;
    const user = await User.findById(req.user._id)
      .select("+password")
      .lean(true);

    if (!user)
      return res.status(404).json(errorFunction(true, "User not found!"));

    const securedPassword = password
      ? await securePassword(password)
      : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: securedPassword || user.password,
        mobileNumber: mobileNumber || user.mobileNumber,
        address: address || user.address,
      },
      { new: true }
    ).exec();

    if (!updatedUser)
      return res
        .status(500)
        .json(errorFunction(true, "Error while updating the user profile!"));

    res
      .status(200)
      .json(
        errorFunction(
          false,
          `User profile of userID: ${req.user._id} updated successfully...`
        )
      );
  } catch (error) {
    logger.error("Error while trying to update user profile. ", error);
    res
      .status(500)
      .json(
        errorFunction(true, `Internal Server  Error due to: ${error.message}`)
      );
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).lean(true);

    if (!user)
      return res.status(404).json(errorFunction(true, "User not found!"));

    const verificationRecord = await Verification.findOne({
      userId: user._id,
      verificationToken: otp,
      verificationTokenExpiry: { $gt: Date.now() },
    })
      .select("verificationToken verificationTokenExpiry")
      .lean(true);

    if (!verificationRecord)
      return res
        .status(400)
        .json(errorFunction(true, "Invalid OTP or OTP is expired!"));

    await User.updateOne({ _id: user._id }, { verified: true }).exec();

    await Verification.deleteOne({ _id: verificationRecord._id }).exec();

    res
      .status(201)
      .json(
        errorFunction(
          false,
          "Email verified successfully. Please continue to login with your credentials."
        )
      );
  } catch (error) {
    logger.error("Error while trying to verify email.", error);
    return res
      .status(500)
      .json(
        errorFunction(true, `Internal Server Error due to: ${error.message}`)
      );
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).lean(true);

    if (!user)
      return res.status(404).json(errorFunction(true, "User not found!"));

    if (user.verified)
      return res
        .status(401)
        .json(
          errorFunction(
            true,
            "The user you are trying to verify is verified already. No need to verify again! Please continue to login with your credentials."
          )
        );

    try {
      await VerificationController.sendVerificationEmail(user, email);
    } catch (error) {
      logger.error("Error while resending the verification email . ", error);
      return res
        .status(500)
        .json(
          errorFunction(
            true,
            `Failed to resend verification email: ${error.message}`
          )
        );
    }

    res
      .status(201)
      .json(
        errorFunction(
          false,
          "Verification email resend successfully. Please check your email."
        )
      );
  } catch (error) {
    logger.error(
      "Error while trying to resend the verification email. ",
      error
    );
    return res
      .status(500)
      .json(
        errorFunction(true, `Internal Server Error due to: ${error.message}`)
      );
  }
};

module.exports = {
  registerUser,
  handleLogin,
  forgotPassword,
  updateUserProfile,
  verifyEmail,
  resendVerificationEmail,
};
