const asyncMiddleware = require("../middleware/asyncMiddleware");
const CustomError = require("../utils/CustomError");
const { Customer, validateCustomer } = require("../models/Customer");

exports.createCustomer = asyncMiddleware(async (req, res, next) => {
  const err = validateCustomer(req);
  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  const { isGold, name, phone } = req.body;
  const customer = await Customer.create({
    name,
    phone,
    isGold,
  });

  res.status(201).json({
    status: "success",
    data: { customer },
  });
});

exports.getCustomers = asyncMiddleware(async (req, res, next) => {
  const customers = await Customer.find().sort("name");

  res.status(200).json({
    status: "success",
    count: customers.length,
    data: { customers },
  });
});

exports.getCustomer = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);

  if (!customer) {
    const error = new CustomError(
      "Customer with a given ID does not exist",
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: { customer },
  });
});

exports.updateCustomer = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    const error = new CustomError(
      "Customer with a given ID does not exist",
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: { customer },
  });
});

exports.deleteCustomer = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    const error = new CustomError(
      "Customer with a given ID does not exist",
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: { customer },
  });
});
