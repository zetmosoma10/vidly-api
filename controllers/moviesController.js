const { Movie, validateMovie } = require("../models/Movie");
const { Genre } = require("../models/Genre");
const CustomError = require("../utils/CustomError");

exports.createMovie = async (req, res) => {
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
};

exports.getMovies = async (req, res) => {
  const movies = await Movie.find();

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: { movies },
  });
};

exports.getMovie = async (req, res) => {
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
};

exports.updateMovie = async (req, res) => {
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
};

exports.deleteMovie = async (req, res) => {
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
};
