const express = require("express");
const { authProtect, authRestrict} = require('../middleware/auth')
const {
  getGenres,
  getGenre,
  createGenre,
  deleteGenre,
} = require("../controllers/genresController");

const router = express.Router();

router.route("/").get(getGenres).post(authProtect, authRestrict, createGenre);
router.route("/:id").get(getGenre).delete(authProtect,authRestrict,  deleteGenre);

module.exports = router;
