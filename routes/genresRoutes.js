const express = require("express");
const {
  getGenres,
  getGenre,
  createGenre,
  deleteGenre,
} = require("../controllers/genresController");

const router = express.Router();

router.route("/").get(getGenres).post(creatGenre);
router.route("/:id").get(getGenre).delete(deleteGenre);

module.exports = router;
