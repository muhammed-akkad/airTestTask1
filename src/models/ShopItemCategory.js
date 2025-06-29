const mongoose = require('mongoose');

const ShopItemCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShopItemCategory', ShopItemCategorySchema);