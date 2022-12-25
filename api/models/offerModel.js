const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  photo: {
    type: String,
  },
  description: {
    type: String,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
});

const Offer = new mongoose.model('Offer', offerSchema);
module.exports = Offer;
