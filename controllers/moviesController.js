const { Movie, validateMovie } = require("../models/Movie");
const { Genre } = require("../models/Genre");

exports.createMovie = async (req, res) => {
  const err = validateMovie(req);
  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid genre",
    });
  }

  const movie = await Movie.create({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
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

exports.getMovie = async (req, res) => {};

exports.updateMovie = async (req, res) => {};

exports.deleteMovie = async (req, res) => {};
