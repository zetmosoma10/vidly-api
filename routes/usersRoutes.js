const express = require("express");
const { authProtect, authRestrict } = require("../middleware/auth");
const {
  createUser,
  getUsers,
  getCurrentUser,
} = require("../controllers/usersController");

const router = express.Router();

router.route("/").get(authProtect, authRestrict, getUsers).post(createUser);
router.route("/me").get(authProtect, getCurrentUser);

module.exports = router;
