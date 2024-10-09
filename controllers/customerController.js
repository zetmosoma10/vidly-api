const { Customer, validateCustomer } = require("../models/Customer");

exports.createCustomer = async (req, res) => {
  const err = validateCustomer(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  const { isGold, name, phone } = req.body;
  const customer = await Customer.create({
    name,
    phone,
    isGold,
  });

  res.status(201).json({
    status: "success",
    data: customer,
  });
};

exports.getCustomers = async (req, res) => {
  const customers = await Customer.find().sort("name");

  res.status(200).json({
    status: "success",
    count: customers.length,
    data: { customers },
  });
};

exports.getCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);

  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: "Customer with a given ID does not exist",
    });
  }

  res.status(200).json({
    status: "success",
    data: { customer },
  });
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: "Customer with a given ID does not exist",
    });
  }

  res.status(200).json({
    status: "success",
    data: { customer },
  });
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: "Customer with a given ID does not exist",
    });
  }

  res.status(204).json({
    status: "success",
    data: { customer },
  });
};
