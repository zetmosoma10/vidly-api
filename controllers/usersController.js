const { User, validateUser } = require("../models/User");

exports.createUser = async (req, res) => {
  const err = validateUser(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
};
