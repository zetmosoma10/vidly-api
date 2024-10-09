const catchAllRoutes = (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Invalid resource: ${req.originalUrl}`,
  });
};

module.exports = catchAllRoutes;
