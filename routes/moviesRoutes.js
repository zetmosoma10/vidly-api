const express = require("express");
const { authProtect, authRestrict } = require("../middleware/auth");
const {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  updateMovie,
} = require("../controllers/moviesController");

const router = express.Router();

router.route("/").get(getMovies).post(authProtect, authRestrict, createMovie);
router
  .route("/:id")
  .get(getMovie)
  .patch(authProtect, updateMovie)
  .delete(authProtect, authRestrict, deleteMovie);

module.exports = router;
