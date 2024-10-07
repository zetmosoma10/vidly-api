const { Rental, validateRentals } = require("../models/Rentals");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");
const mongoose = require("mongoose");

exports.createRental = async (req, res) => {
  const err = validateRentals(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid customer",
    });
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid movie",
    });
  }

  if (movie.numberInStock === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Movie not in stock",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const rental = await Rental.create(
      [
        {
          customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
          },
          movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
          },
        },
      ],
      { session }
    );

    movie.numberInStock--;
    await movie.save({ session });

    // * COMMIT TRANSACTION
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      data: { rental },
    });
  } catch (error) {
    // ! ABORT SESSION
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      status: "error",
      message: "Something happened, try again later.",
    });
  }
};

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
