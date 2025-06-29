const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopItemCategory',
    required: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ShopItem', ShopItemSchema);