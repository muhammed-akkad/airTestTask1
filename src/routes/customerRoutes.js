const express = require('express');
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  deleteAllCustomers
} = require('../controllers/customerController');

const router = express.Router();

router
  .route('/')
  .get(getCustomers)
  .post(createCustomer)
  .delete(deleteAllCustomers);

router
  .route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;