const AppError = require('../utils/appError');
const Notification = require('./../models/notificationModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  let notifications = await Notification.find();
  res.status(200).json({
    status: 'success',
    notifications,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  let { notificationId } = req.query;
  let deletedNotification = await Notification.findOneAndDelete({
    _id: notificationId,
  });
  res.status(200).json({
    status: 'success',
    deletedNotification,
  });
});
