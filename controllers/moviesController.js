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
    return res.status(404).json({
      status: "fail",
      message: "Movie with given ID doesn't exist",
    });
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
    return res.status(404).json({
      status: "fail",
      message: "Movie with given ID doesn't exist",
    });
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
    return res.status(404).json({
      status: "fail",
      message: "Movie with given ID doesn't exist",
    });
  }

  res.status(204).json({
    status: "success",
    data: { deletedMovie },
  });
};
