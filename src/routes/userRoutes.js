const express = require("express");
const {
  registerUser,
  handleLogin,
  //   testController,
  forgotPassword,
  updateUserProfile,
  verifyEmail,
  resendVerificationEmail,
  //   getOrdersController,
  //   getAllOrdersController,
  //   orderStatusController,
} = require("../controllers/userController");
const userValidation = require("../middlewares/validationMiddlewares/user.routes.validation.middleware/userValidationMiddleware");
const loginValidation = require("../middlewares/validationMiddlewares/user.routes.validation.middleware/loginValidationMiddleware");
const emailVerificationValidation = require("../middlewares/validationMiddlewares/user.routes.validation.middleware/emailVerification.validation.middleware");
const passwordResetValidation = require("../middlewares/validationMiddlewares/user.routes.validation.middleware/passwordResetValidationMiddleware");
const userProfileUpdateValidation = require("../middlewares/validationMiddlewares/user.routes.validation.middleware/userProfileUpdateValidationMiddleware");
const emailValidation = require("../middlewares/validationMiddlewares/email.validation.middleware");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

router.route("/register").post(userValidation, registerUser);

router.route("/auth/login").post(loginValidation, handleLogin);

// //protected User route auth
// router.get("/user-auth", requireSignIn, (req, res) => {
//   res.status(200).send({ ok: true });
// });

// //protected Admin route auth
// router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
//   res.status(200).send({ ok: true });
// });

router.post("/auth/email-verify", emailVerificationValidation, verifyEmail);

router.post(
  "/auth/resend-verification-email",
  emailValidation,
  resendVerificationEmail
);

router.post("/auth/forgot-password", passwordResetValidation, forgotPassword);

router
  .route("/profile")
  .patch(userProfileUpdateValidation, requireSignIn, updateUserProfile);

module.exports = router;
