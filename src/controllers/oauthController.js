const passport = require("passport");
const User = require("../models/userModel");
const errorFunction = require("../utils/errorFunction");

exports.authenticateGoogle = passport.authenticate("google", {
  scope: ["email", "profile", "openid"],
});

exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      console.error("OAuth error: ", err);
      return res
        .status(400)
        .json(errorFunction(true, "OAuth authentication failed!"));
    }

    if (!user) return res.redirect("/auth/google/failure");

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error: ", err);
        return res.status(401).json(errorFunction(true, "Login failed!"));
      }

      return res.redirect("/protected");
    });

    // successRedirect: "protected",
    // failureRedirect: "auth/google/failure",
  })(req, res, next);
};

exports.protectedPage = (req, res) => {
  res
    .status(200)
    .json(errorFunction(false, `${req.user.name} signed in successfully.`));
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json(errorFunction(true, "Logout failed due to: " + err.message));
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
};

exports.googleFailure = (req, res) => {
  res.status(401).json(errorFunction(true, "Failed to authenticate!"));
};

exports.googleLogin = async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile) return done(new Error("Profile data is missing"), null);

    let user = await User.findOne({ googleId: profile.id }).lean(true);
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        verified: true,
        googleProfile: profile._json,
        authMethod: "google",
      });

      await user.save({ validateBeforeSave: false });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
};

exports.completeUserProfile = async (req, res) => {
  const { userId, mobileNumber, address, answer } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .json(errorFunction(true, `User not found for userId: ${userId}!`));

    user.mobileNumber = mobileNumber;
    user.address = address;
    user.answer = answer;

    await user.save();
    res.redirect("protected");
  } catch (error) {
    return res
      .status(500)
      .json(errorFunction(true, "Error updating user profile!"));
  }
};
