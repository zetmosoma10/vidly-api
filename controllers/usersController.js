const { User, validateUser } = require("../models/User");
const CustomError = require("../utils/CustomError");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const _ = require("lodash");

exports.getCurrentUser = asyncMiddleware(async (req, res, next) => {
  const user = req.user.toObject();
  res.status(200).json({
    status: "success",
    data: { user: _.omit(user, ["updatedAt", "__v", "password", "_id"]) },
  });
});

exports.createUser = asyncMiddleware(async (req, res, next) => {
  const err = validateUser(req);
  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  const { name, email, password, isAdmin } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      status: "fail",
      message: "User already registered",
    });
  }

  const newUser = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  //  * GENERATE JWT
  const token = newUser.generateAuthToken();

  res.status(201).json({
    status: "success",
    token,
    data: { user: _.pick(newUser, ["name", "email", "_id", "isAdmin"]) },
  });
});

exports.getUsers = asyncMiddleware(async (req, res, next) => {
  const users = await User.find().select("-password -__v");

  res.status(200).json({
    status: "success",
    count: users.length,
    data: { users },
  });
});
