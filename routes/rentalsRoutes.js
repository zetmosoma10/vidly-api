const express = require("express");
const { authProtect, authRestrict } = require("../middleware/auth");
const {
  createRental,
  getRental,
  getRentals,
} = require("../controllers/rentalsController");

const router = express.Router();

router
  .route("/")
  .get(authProtect, authRestrict, getRentals)
  .post(authProtect, createRental);

module.exports = router;
