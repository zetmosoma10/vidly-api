const express = require("express");
const { authProtect, authRestrict } = require("../middleware/auth");
const {
  createRental,
  deleteRental,
  getRental,
  getRentals,
  updateRental,
} = require("../controllers/rentalsController");

const router = express.Router();

router
  .route("/")
  .get(authProtect, authRestrict, getRentals)
  .post(authProtect, createRental);
router
  .route("/:id")
  .get(authProtect, getRental)
  .patch(authProtect, updateRental)
  .delete(authProtect, deleteRental);

module.exports = router;
