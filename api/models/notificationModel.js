const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  msg: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  userType: {
    type: String,
  },
});

const Notification = new mongoose.model('Notification', notificationSchema);
module.exports = Notification;
