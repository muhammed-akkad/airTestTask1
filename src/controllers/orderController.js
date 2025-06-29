const { Order, Customer, ShopItem } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res) => {
  const { customer, items } = req.body;
  
  // Check if customer exists
  const customerExists = await Customer.findById(customer);
  if (!customerExists) {
    return res.status(404).json({
      success: false,
      error: 'Customer not found'
    });
  }
  
  // Validate shop items
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Orders must have at least one item'
    });
  }
  
  // Check if all shop items exist and have valid quantities
  for (const item of items) {
    const shopItem = await ShopItem.findById(item.shopItem);
    if (!shopItem) {
      return res.status(404).json({
        success: false,
        error: `Shop item with id ${item.shopItem} not found`
      });
    }
    
    if (!item.quantity || item.quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Item quantity must be at least 1'
      });
    }
  }
  
  const order = await Order.create(req.body);
  
  // Populate the order with customer and shop item details
  const populatedOrder = await Order.findById(order._id)
    .populate('customer')
    .populate({
      path: 'items.shopItem',
      model: 'ShopItem'
    });
  
  res.status(201).json({
    success: true,
    data: populatedOrder
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('customer')
    .populate({
      path: 'items.shopItem',
      model: 'ShopItem'
    });
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer')
    .populate({
      path: 'items.shopItem',
      model: 'ShopItem'
    });
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Public
exports.updateOrder = asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  // If customer is being updated, check if exists
  if (req.body.customer) {
    const customerExists = await Customer.findById(req.body.customer);
    if (!customerExists) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
  }
  
  // If items are being updated, validate them
  if (req.body.items) {
    if (req.body.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Orders must have at least one item'
      });
    }
    
    for (const item of req.body.items) {
      const shopItem = await ShopItem.findById(item.shopItem);
      if (!shopItem) {
        return res.status(404).json({
          success: false,
          error: `Shop item with id ${item.shopItem} not found`
        });
      }
      
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          error: 'Item quantity must be at least 1'
        });
      }
    }
  }
  
  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('customer')
    .populate({
      path: 'items.shopItem',
      model: 'ShopItem'
    });
  
  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Public
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  await order.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});