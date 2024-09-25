const express = require("express");
const { getGenres, getGenre } = require("../controllers/genresController");

const router = express.Router();

router.get("/", getGenres);
router.get("/:id", getGenre);

module.exports = router;
