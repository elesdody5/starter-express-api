const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  photo: {
    type: String,
  },
});

const Category = new mongoose.model('Category', categorySchema);
module.exports = Category;
