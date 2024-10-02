const mongoose = require("mongoose");
const Joi = require("joi");
const { Genre } = require("./Genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    default: 0,
  },
  genre: Genre,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports.Movie = Movie;
