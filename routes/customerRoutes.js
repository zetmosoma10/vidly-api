const express = require("express");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  getCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.route("/").get(getCustomers).post(createCustomer);
router
  .route("/:id")
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
