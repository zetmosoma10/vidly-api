const { Genre, validateGenre } = require("../models/Genre");

exports.createGenre = async (req, res) => {
  const err = validateGenre(req);

  if (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
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
    return res.status(404).json({
      status: "fail",
      message: "Genre with that ID does not exist.",
    });
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
    return res.status(404).json({
      status: "fail",
      message: "Genre with that ID does not exist.",
    });
  }

  res.status(204).json({
    status: "success",
  });
};
