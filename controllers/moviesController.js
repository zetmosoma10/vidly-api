const { Movie, validateMovie } = require("../models/Movie");
const { Genre } = require("../models/Genre");
const CustomError = require("../utils/CustomError");
const validateObjectId = require("../utils/validateObjectId");
const asyncMiddleware = require("../middleware/asyncMiddleware");

exports.createMovie = asyncMiddleware(async (req, res, next) => {
  const err = validateMovie(req);
  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    const error = new CustomError("Invalid genre", 404);
    return next(error);
  }

  const movie = await Movie.create({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      genre: genre.genre,
    },
  });

  res.status(201).json({
    status: "success",
    data: { movie },
  });
});

exports.getMovies = asyncMiddleware(async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: { movies },
  });
});

exports.getMovie = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);

  if (!movie) {
    const error = new CustomError("Movie with given ID doesn't exist", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: { movie },
  });
});

exports.updateMovie = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    const error = new CustomError("Movie with given ID doesn't exist", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: { movie },
  });
});

exports.deleteMovie = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const deletedMovie = await Movie.findByIdAndDelete(id);

  if (!deletedMovie) {
    const error = new CustomError("Movie with given ID doesn't exist", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: { deletedMovie },
  });
});
