const express = require("express");
const {
  createRental,
  deleteRental,
  getRental,
  getRentals,
  updateRental,
} = require("../controllers/rentalsController");

const router = express.Router();

router.route("/").get(getRentals).post(createRental);
router.route("/:id").get(getRental).patch(updateRental).delete(deleteRental);

module.exports = router;
