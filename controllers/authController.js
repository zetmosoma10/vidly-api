const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const validateLoginUser = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(255).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return error.details.map((err) => err.message).join(", ");
  }

  return null;
};

exports.loginUser = async (req, res) => {
  const err = validateLoginUser(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  const { email, password } = req.body;
  // * 1 - Check if email exist
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  // * 2 - Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  //  * GENERATE JWT
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXP }
  );

  res.status(200).json({
    status: "success",
    token,
  });
};


