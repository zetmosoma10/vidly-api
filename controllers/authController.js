const Joi = require("joi");
const bcrypt = require("bcrypt");
const CustomError = require("../utils/CustomError");
const asyncMiddleware = require("../middleware/asyncMiddleware");
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

exports.loginUser = asyncMiddleware(async (req, res, next) => {
  const err = validateLoginUser(req);
  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  const { email, password } = req.body;
  // * 1 - Check if email exist
  const user = await User.findOne({ email });
  if (!user) {
    const error = new CustomError("Invalid email or password", 400);
    return next(error);
  }

  // * 2 - Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new CustomError("Invalid email or password", 400);
    return next(error);
  }

  //  * GENERATE JWT
  const token = user.generateAuthToken();

  res.status(200).json({
    status: "success",
    token,
  });
});
