const mongoose = require('mongoose');
// let uniqueValidator = require('mongoose-unique-validator');
const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  favoriteShops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      default: null,
    },
  ],
});

const Favorite = new mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
