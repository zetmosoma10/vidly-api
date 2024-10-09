const { User, validateUser } = require("../models/User");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const err = validateUser(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  try {
    const { name, email, password } = req.body;
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
    });

    //  * GENERATE JWT
    const token = jwt.sign(
      { _id: newUser._id, name: newUser.name, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP }
    );

    res.status(201).json({
      status: "success",
      token,
      data: { user: _.pick(newUser, ["name", "email", "_id"]) },
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
    const users = await User.find();

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
