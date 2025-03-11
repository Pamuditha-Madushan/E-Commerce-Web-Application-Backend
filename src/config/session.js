const isProduction = process.env.NODE_MODE === "production";

module.exports = {
  secret: process.env.SESSION_SECRET_KEY || "cats",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 1 * 60 * 60 * 1000,
  },
};
