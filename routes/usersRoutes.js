const express = require("express");
const { createUser, getUsers } = require("../controllers/usersController");

const router = express.Router();

router.route("/").get(getUsers).post(createUser);

module.exports = router;
