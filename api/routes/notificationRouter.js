const express = require('express');
const router = express.Router(); //We created sub application for notifications

const {
  deleteNotification,
  getAllNotifications,
} = require('../controllers/notificationController');

router.route('/').get(getAllNotifications);
router.route('/notification').delete(deleteNotification);

module.exports = router;
