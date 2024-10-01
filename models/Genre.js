const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: [true, "Genre is required field"],
    minLength: 3,
    maxLength: 50,
    trim: true,
    unique: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;
