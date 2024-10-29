const express = require("express");
const { authProtect, authRestrict} = require('../middleware/auth')
const { validateObjectId } = require("../middleware/validateObjectId");
const {
  getGenres,
  getGenre,
  createGenre,
  deleteGenre,
} = require("../controllers/genresController");

const router = express.Router();

router.route("/").get(getGenres).post(authProtect, authRestrict, createGenre);
router
  .route("/:id")
  .get(validateObjectId, getGenre)
  .delete(authProtect, authRestrict, validateObjectId, deleteGenre);

module.exports = router;
