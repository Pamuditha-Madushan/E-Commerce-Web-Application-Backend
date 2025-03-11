const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const authController = require("../controllers/oauthController");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3500/google/callback",
      // passReqToCallback: true, // keep this commented for not receiving the error: typeError: 'done' is not a function.
    },
    authController.googleLogin
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      if (!user) return done(new Error("User not found"), null);

      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});
