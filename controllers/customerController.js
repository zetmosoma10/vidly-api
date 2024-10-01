const Joi = require("joi");
const Customer = require("../models/Customer");

exports.createCustomer = async (req, res) => {
  validateCustomer(req);
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
    res.status(404).json({
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

exports.updateDelete = async (req, res) => {
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

function validateCustomer(req) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((err) => err.message).join(", ");
    return res.status(400).json({
      status: "fail",
      message: errMsg,
    });
  }
}
