const asyncMiddleware = require("../middleware/asyncMiddleware");
const CustomError = require("../utils/CustomError");
const validateObjectId = require("../utils/validateObjectId");
const { Genre, validateGenre } = require("../models/Genre");

exports.createGenre = asyncMiddleware(async (req, res, next) => {
  const err = validateGenre(req);
  if (err) {
    const error = new CustomError(err, 400);
    return next(error);
  }

  const genre = await Genre.create({ genre: req.body.genre });

  res.status(201).json({
    status: "success",
    data: { genre },
  });
});

exports.getGenres = asyncMiddleware(async (req, res, next) => {
  const genres = await Genre.find().sort("name");

  res.status(200).json({
    status: "success",
    data: {
      genres,
    },
  });
});

exports.getGenre = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const err = validateObjectId(id);
  if (err) {
    return next(new CustomError(err, 400));
  }
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return next(new CustomError("Invalid ObjectId.", 400)); // Return a 400 error
  // }

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
});

exports.deleteGenre = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const err = validateObjectId(id);
  if (err) {
    return next(new CustomError(err, 400));
  }

  const genre = await Genre.findByIdAndDelete(id);

  if (!genre) {
    const error = new CustomError("Genre with that ID does not exist.", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: { genre },
  });
});
