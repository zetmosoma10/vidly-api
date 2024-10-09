const { Genre, validateGenre } = require("../models/Genre");

exports.createGenre = async (req, res) => {
  const err = validateGenre(req);

  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  try {
    const genre = await Genre.create({ genre: req.body.genre });

    res.status(201).json({
      status: "success",
      data: { genre },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Something went wrong, try again later",
      err: error,
    });
  }
};

exports.getGenres = async (req, res) => {
  const genres = await Genre.find().sort("name");

  res.status(200).json({
    status: "success",
    data: {
      genres,
    },
  });
};

exports.getGenre = async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findById(id);

  if (!genre) {
    const error = new CustomError("Genre with that ID does not exist.", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      genre,
    },
  });
};

exports.deleteGenre = async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findByIdAndDelete(id);

  if (!genre) {
    const error = new CustomError("Genre with that ID does not exist.", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
  });
};
