const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
});

const SubCategory = new mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
