const catchAsync = require("../utils/catchAsync");
const Service = require("../models/serviceModel");
var mongoose = require("mongoose");
const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require("../utils/firebaseStorage");

//@desc Create service
//@route POST /api/v1/services/service
//access PUBLIC
exports.createService = catchAsync(async (req, res, next) => {
  handleStoringImageAndCreatingElement("services", req, res);
});

//@desc Get all services
//@route GET /api/v1/services/
//access PUBLIC
exports.getAllServices = catchAsync(async (req, res, next) => {
  let services = await Service.find();
  res.status(200).json({
    status: "success",
    services,
  });
});

//@desc Delete a service by ID
//@route Delete /api/v1/services/service
//access PUBLIC
exports.deleteServiceById = catchAsync(async (req, res, next) => {
  let deletedService = await Service.findOneAndDelete({
    _id: req.query.serviceId,
  });
  res.status(200).json({
    status: "success",
    deletedService,
  });
});

//@desc Update a category by ID
//@route Update /api/v1/services/service ==>We pass service ID in query
//access PUBLIC
exports.updateServiceById = catchAsync(async (req, res, next) => {
  let { serviceId } = req.query;
  handleUpdatingAndStoringElement("services", req, res, serviceId);
});

//@desc Get a service by Id
//@route GET /api/v1/services/service
//access PUBLIC
exports.getServiceById = catchAsync(async (req, res, next) => {
  let { serviceId } = req.query;
  let service = await Service.findById({ _id: serviceId });
  res.status(200).json({
    status: "success",
    service,
  });
});
