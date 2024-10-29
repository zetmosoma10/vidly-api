const express = require("express");
const { validateObjectId } = require("../middleware/validateObjectId");
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
  .get(validateObjectId, getCustomer)
  .patch(validateObjectId, updateCustomer)
  .delete(validateObjectId, deleteCustomer);

module.exports = router;
