const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: [true, "Name is required field"],
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = (req) => {
  const schema = Joi.object({
    genre: Joi.string().min(3).max(50).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return error.details.map((err) => err.message).join(", ");
  }

  return null;
};

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validateGenre = validateGenre;
