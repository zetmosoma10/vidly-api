const asyncMiddleware = require("../middleware/asyncMiddleware");
const { Movie } = require("../models/Movie");
const { Rental } = require("../models/Rentals");
const CustomError = require("../utils/CustomError");
const moment = require("moment");
const Joi = require("joi");

const validateReturns = (req) => {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return error.details.map((err) => err.message).join(", ");
  }

  return null;
};

exports.createReturns = asyncMiddleware(async (req, res, next) => {
  const error = validateReturns(req);
  if (error) {
    return next(new CustomError(error.message, 400));
  }

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) {
    return next(new CustomError("rental not found", 404));
  }

  if (rental.dateReturned) {
    return next(new CustomError("return already processed", 400));
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
