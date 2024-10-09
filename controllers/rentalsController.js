const { Rental, validateRentals } = require("../models/Rentals");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");

exports.createRental = async (req, res) => {
  const err = validateRentals(req);
  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    const error = new CustomError("Invalid customer", 404);
    return next(error);
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    const error = new CustomError("Invalid movie", 404);
    return next(error);
  }

  if (movie.numberInStock === 0) {
    const error = new CustomError("Movie not in stock", 400);
    return next(error);
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

// TODO: BUILD GET RENTAL BY ID
exports.getRental = async (req, res) => {};
