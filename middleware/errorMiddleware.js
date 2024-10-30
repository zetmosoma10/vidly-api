const CustomError = require("../utils/customError");

const developmentErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const productionErrors = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong, please try again later",
    });
  }
};

// !ERRORS FROM MONGOOSE (name:CastError, name:ValidationError , code:11000)
//
// !CastError HANDLER
const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}:${err.value}`;
  return new CustomError(msg, 404);
};
//
// ! Code:11000 HANDLER
const duplicateKeyErrorHandler = (err) => {
  const fieldName = Object.keys(err.keyValue)[0];
  const fieldValue = err.keyValue[fieldName];

  const msg = `A record with ${fieldName}: '${fieldValue}' already exists in the database. Please use another ${fieldName}.`;
  return new CustomError(msg, 400);
  // const msg = `Movie with name: '${err.keyValue.name}' already exist in database. Please use another name.`;
};
//
// ! ValidationError HANDLER
const validationErrorHandler = (err) => {
  const errorMessages = Object.values(err.errors).map((item) => item.message);
  const msg = `Invalid input data: ${errorMessages.join(". ")}`;
  return new CustomError(msg, 400);
};
//
//! ERROR FROM JSONWEBTOKEN LIBRARY
//
//! TokenExpireError
const tokenExpireErrorHandler = (err) => {
  return new CustomError("Token expired, Please login again!", 401);
};
//
//! JsonWebTokenError
const JsonWebTokenErrorHandler = (err) => {
  return new CustomError("Invalid token signature, Please login again!", 401);
};

// * GLOBAL ERROR MIDDLEWARE
function errorMiddleware(error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    developmentErrors(error, res);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "JsonWebTokenError")
      error = JsonWebTokenErrorHandler(error);
    if (error.name === "TokenExpiredError")
      error = tokenExpireErrorHandler(error);

    productionErrors(error, res);
  } else if (process.env.NODE_ENV === "test") {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
}

module.exports = errorMiddleware;
