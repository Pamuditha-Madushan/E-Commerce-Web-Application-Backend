const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
