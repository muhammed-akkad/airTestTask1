const { ShopItem, ShopItemCategory } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new shop item
// @route   POST /api/items
// @access  Public
exports.createShopItem = asyncHandler(async (req, res) => {
  // Validate if all categories exist
  if (req.body.categories && req.body.categories.length > 0) {
    const categoryIds = req.body.categories;
    const categoryCount = await ShopItemCategory.countDocuments({
      _id: { $in: categoryIds }
    });
    
    if (categoryCount !== categoryIds.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more categories do not exist'
      });
    }
  }
  
  const shopItem = await ShopItem.create(req.body);
  
  res.status(201).json({
    success: true,
    data: shopItem
  });
});

// @desc    Get all shop items
// @route   GET /api/items
// @access  Public
exports.getShopItems = asyncHandler(async (req, res) => {
  const shopItems = await ShopItem.find().populate('categories');
  res.status(200).json({
    success: true,
    count: shopItems.length,
    data: shopItems
  });
});

// @desc    Get single shop item
// @route   GET /api/items/:id
// @access  Public
exports.getShopItem = asyncHandler(async (req, res) => {
  const shopItem = await ShopItem.findById(req.params.id).populate('categories');
  
  if (!shopItem) {
    return res.status(404).json({
      success: false,
      error: 'Shop item not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: shopItem
  });
});

// @desc    Update shop item
// @route   PUT /api/items/:id
// @access  Public
exports.updateShopItem = asyncHandler(async (req, res) => {
  let shopItem = await ShopItem.findById(req.params.id);
  
  if (!shopItem) {
    return res.status(404).json({
      success: false,
      error: 'Shop item not found'
    });
  }
  
  // Validate categories if provided
  if (req.body.categories && req.body.categories.length > 0) {
    const categoryIds = req.body.categories;
    const categoryCount = await ShopItemCategory.countDocuments({
      _id: { $in: categoryIds }
    });
    
    if (categoryCount !== categoryIds.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more categories do not exist'
      });
    }
  }
  
  shopItem = await ShopItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('categories');
  
  res.status(200).json({
    success: true,
    data: shopItem
  });
});

// @desc    Delete shop item
// @route   DELETE /api/items/:id
// @access  Public
exports.deleteShopItem = asyncHandler(async (req, res) => {
  const shopItem = await ShopItem.findById(req.params.id);
  
  if (!shopItem) {
    return res.status(404).json({
      success: false,
      error: 'Shop item not found'
    });
  }
  
  await shopItem.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});