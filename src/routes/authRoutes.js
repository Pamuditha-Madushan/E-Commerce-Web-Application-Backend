const express = require("express");
const router = express.Router();
const authController = require("../controllers/oauthController");
const isLoggedIn = require("../middlewares/oauthMiddleware");

router.get("/", (req, res) => {
  res.send('<a href="auth/google">Authenticate with Google</a>');
});

router.get("/auth/google", authController.authenticateGoogle);
router.get("/google/callback", authController.googleCallback);

router.get("/protected", isLoggedIn, authController.protectedPage);

router.get("/logout", authController.logout);

router.get("/auth/google/failure", authController.googleFailure);

router.post(
  "/complete-user-profile",
  isLoggedIn,
  authController.completeUserProfile
);

module.exports = router;
