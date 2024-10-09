const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const { User } = require("../models/User");

exports.authProtect = async (req, res, next) => {
  try {
    // * 1 - CHECK IF TOKEN EXIST IN REQ-HEADER
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      const err = new CustomError("Access denied. No token provided.", 401);
      return next(err);
    }
    // if (!token) {
    //   return res.status(401).json({
    //     status: "fail",
    //     message: "Access denied. No token provided.",
    //   });
    // }
    // * 2 - VERIFY THE TOKEN
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // * 3 - CHECK THE USER FROM DB WITH TOKEN_ID
    const user = await User.findById(decodedToken._id);
    if (!user) {
      const err = new CustomError(
        "User not found. Please ensure the account associated with this token exists",
        404
      );
      return next(err);
    }
    // * 3.2 - ATTACH USER TO REQ-OBJ
    req.user = user;
    // * 4 - PASS CONTROL TO NEXT MIDDLEWARE
    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid token.",
      error: error.message,
    });
  }
};

exports.authRestrict = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: "fail",
      message: "Access denied. Forbidden",
    });
  }

  next();
};
