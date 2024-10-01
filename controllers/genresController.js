const Joi = require("joi");
const Genre = require("../models/Genre");

exports.createGenre = async (req, res) => {
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

  const genre = await Genre.create({
    genre: req.body.genre,
  });

  res.status(201).json({
    status: "success",
    data: genre,
  });
};

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
