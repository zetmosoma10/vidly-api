const CustomError = require("../utils/CustomError");

const catchAllRoutes = (req, res, next) => {
  const error = new CustomError(`Invalid resource: ${req.originalUrl}`, 404);
  return next(error);
};

module.exports = catchAllRoutes;
