const asyncMiddleware = require("../middleware/asyncMiddleware");
const { Customer } = require("../models/Customer");
const { Movie } = require("../models/Movie");
const { Rental } = require("../models/Rentals");
const CustomError = require("../utils/CustomError");
const moment = require("moment");

exports.createReturns = asyncMiddleware(async (req, res, next) => {
  if (!req.body.customerId) {
    const err = new CustomError("customerId is required", 400);
    return next(err);
  }

  if (!req.body.movieId) {
    const err = new CustomError("movieId id is required", 400);
    return next(err);
  }

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) {
    const err = new CustomError("rental not found", 404);
    return next(err);
  }

  if (rental.dateReturned) {
    const err = new CustomError("return already processed", 400);
    return next(err);
  }

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();
  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});
