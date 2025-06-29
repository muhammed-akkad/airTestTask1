const { Customer } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Delete all customers
// @route   DELETE /api/customers
// @access  Public
exports.deleteAllCustomers = asyncHandler(async (req, res) => {
  await Customer.deleteMany({});
  
  res.status(200).json({
    success: true,
    message: 'All customers deleted successfully',
    data: {}
  });
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public
exports.createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({
    success: true,
    data: customer
  });
});

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public
exports.getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Public
exports.getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  
  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Public
exports.updateCustomer = asyncHandler(async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  
  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found'
    });
  }
  
  customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Public
exports.deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  
  if (!customer) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found'
    });
  }
  
  await customer.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});