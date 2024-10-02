const express = require("express");
const {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  updateMovie,
} = require("../controllers/moviesController");

const router = express.Router();

router.route("/").get(getMovies).post(createMovie);
router.route("/:id").get(getMovie).patch(updateMovie).delete(deleteMovie);

module.exports = router;
