const mongoose = require('mongoose');
const OrderItemSchema = require('./OrderItem').schema;

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [OrderItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Calculate total price before saving
OrderSchema.pre('save', async function(next) {
  let total = 0;
  
  // Populate items with shopItem details to get prices
  for (const item of this.items) {
    if (item.shopItem) {
      // If shopItem is already a populated object with price
      if (typeof item.shopItem === 'object' && item.shopItem.price) {
        total += item.shopItem.price * item.quantity;
      } 
      // If shopItem is just an ID, we need to populate it
      else {
        const ShopItem = mongoose.model('ShopItem');
        const shopItem = await ShopItem.findById(item.shopItem);
        if (shopItem) {
          total += shopItem.price * item.quantity;
        }
      }
    }
  }
  
  this.totalPrice = total;
  next();
});

module.exports = mongoose.model('Order', OrderSchema);