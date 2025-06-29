const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  shopItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopItem',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);