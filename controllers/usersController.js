const { User, validateUser } = require("../models/User");
const CustomError = require("../utils/CustomError");
const _ = require("lodash");

exports.getCurrentUser = async (req, res) => {
  const user = req.user.toObject();
  res.status(200).json({
    status: "success",
    data: { user: _.omit(user, ["updatedAt", "__v", "password", "_id"]) },
  });
};

exports.createUser = async (req, res) => {
  const err = validateUser(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  try {
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
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");

    res.status(200).json({
      status: "success",
      count: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something happened, try again later",
    });
  }
};
