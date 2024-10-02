const { Rental, validateRentals } = require("../models/Rentals");

exports.createRental = async (req, res) => {};

exports.getRentals = async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");

  res.status(200).json({
    status: "success",
    count: rentals.length,
    data: { rentals },
  });
};

exports.getRental = async (req, res) => {};

exports.updateRental = async (req, res) => {};

exports.deleteRental = async (req, res) => {};
