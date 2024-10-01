const express = require("express");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  getCustomer,
  updateDelete,
} = require("../controllers/customerController");

const router = express.Router();

router.route("/").get(getCustomers).post(createCustomer);
router
  .route("/:id")
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(updateDelete);

module.exports = router;
