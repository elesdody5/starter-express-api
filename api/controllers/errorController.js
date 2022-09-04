const AppError = require('./../utils/appError');
//Format of error that will be displayed in dev
const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value :${value} Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  console.log(err);

  const errors = Object.values(err.erros).map((el) => el.message);
  let message = `Invalid input data ${errors.join('. ')}`;

  return new AppError(message, 400);
};
const handleJWTError = () => new AppError('Invalid token ,please login', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired', 401);

const sendErrorForProduction = (err, res) => {
  console.log('err>>>>>>>>>>>>>', err);
  //if the error is operational EX: cant connect to DB or something else
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming error or other unknown errors
  } else {
    //Log the error!
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};
//Error handling middleware (by passing 4 args, Express recognize that this handler is for operatinal erros)
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // let { message } = err;

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);

    sendErrorForProduction(err, res);
  }
};
