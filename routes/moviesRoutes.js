const express = require("express");
const authProtect = require("../middleware/auth");
const {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  updateMovie,
} = require("../controllers/moviesController");

const router = express.Router();

router.route("/").get(getMovies).post(authProtect, createMovie);
router
  .route("/:id")
  .get(getMovie)
  .patch(authProtect, updateMovie)
  .delete(authProtect, deleteMovie);

module.exports = router;
