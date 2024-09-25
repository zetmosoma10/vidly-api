const Joi = require("joi");

const genres = [
  { id: 1, genre: "Sci-fi" },
  { id: 2, genre: "Drama" },
  { id: 3, genre: "Horror" },
  { id: 4, genre: "Action" },
];

exports.getGenres = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      genres,
    },
  });
};

exports.getGenre = (req, res) => {
  const { id } = req.params;
  const genre = genres.find((g) => g.id === parseInt(id));

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

exports.createGenre = (req, res) => {
  const schema = Joi.object({
    genre: Joi.string().min(3).max(50).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((err) => err.message).join(", ");
    return res.status(400).json({
      status: "fail",
      message: errMsg,
    });
  }

  const genre = {
    id: genres.length + 1,
    genre: req.body.genre,
  };

  genres.push(genre);

  res.status(201).json({
    status: "success",
    data: genre,
  });
};

exports.deleteGenre = (req, res) => {
  const { id } = req.params;
  const genre = genres.find((g) => g.id === parseInt(id));

  if (!genre) {
    return res.status(404).json({
      status: "fail",
      message: "Genre with that ID does not exist.",
    });
  }

  const index = genres.indexOf(genre);
  genres.slice(index, 1);

  res.status(204).json({
    status: "success",
  });
};
