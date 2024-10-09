process.env.NODE_ENV = "production";

function errorMiddleware(error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error: error,
      stack: error.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
}

module.exports = errorMiddleware;
