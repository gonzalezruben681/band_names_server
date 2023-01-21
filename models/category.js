const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
