const express = require("express");
const { authProtect, authRestrict } = require("../middleware/auth");
const { validateObjectId } = require("../middleware/validateObjectId");
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
  .get(validateObjectId, getMovie)
  .patch(authProtect, validateObjectId, updateMovie)
  .delete(authProtect, authRestrict, validateObjectId, deleteMovie);

module.exports = router;
