const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("../models/Genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    unique: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max:255
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max:255
  },
  genre: {
    type: genreSchema,
    required: [true, "Genre is required."],
  },
});

const Movie = mongoose.model("Movie", movieSchema);

// ! VALIDATE MOVIE (Joi)
const validateMovie = (req) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required().trim(),
    numberInStock: Joi.number().min(0).default(0),
    dailyRentalRate: Joi.number().min(0).default(0),
    genreId: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return error.details.map((err) => err.message).join(", ");
  }

  return null;
};

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
