const mongoose = require("mongoose");

exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID.",
    });

  next();
};
