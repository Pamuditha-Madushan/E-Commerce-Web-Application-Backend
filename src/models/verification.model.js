const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    verificationToken: {
      type: String,
      required: true,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

// verificationSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function (next) {
//     if (this.verificationTokenExpiry < Date.now()) {
//       logger.warn("Expired verification token removed from the db.");
//       next();
//     }
//     next();
//   }
// );

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = Verification;
