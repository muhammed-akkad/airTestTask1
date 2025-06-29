const { ShopItemCategory } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await ShopItemCategory.create(req.body);
  res.status(201).json({
    success: true,
    data: category
  });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await ShopItemCategory.find();
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await ShopItemCategory.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Public
exports.updateCategory = asyncHandler(async (req, res) => {
  let category = await ShopItemCategory.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  
  category = await ShopItemCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Public
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await ShopItemCategory.findById(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }
  
  await category.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});