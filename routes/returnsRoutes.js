const express = require("express");
const { authProtect, authRestrict } = require("../middleware/auth");
const { createReturns } = require("../controllers/returnsController");

const router = express.Router();

router.route("/").post(authProtect, createReturns);

module.exports = router;
