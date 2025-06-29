const dotenv = require('dotenv');
const { Customer, ShopItemCategory, ShopItem, Order } = require('../models');
const logger = require('../config/logger');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to DB using the connection function
// that ensures the connection is established before proceeding

// Sample data
const customers = [
  {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com'
  },
  {
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@example.com'
  },
  {
    name: 'Michael',
    surname: 'Johnson',
    email: 'michael.johnson@example.com'
  }
];

const categories = [
  {
    title: 'Electronics',
    description: 'Electronic devices and accessories'
  },
  {
    title: 'Clothing',
    description: 'Apparel and fashion items'
  },
  {
    title: 'Books',
    description: 'Literature, textbooks, and other reading materials'
  },
  {
    title: 'Home & Kitchen',
    description: 'Household items and kitchen appliances'
  }
];

// Function to seed data
const seedData = async () => {
  try {
    // Ensure database connection is established before operations
    await connectDB();
    
    // Clear existing data
    await Customer.deleteMany();
    await ShopItemCategory.deleteMany();
    await ShopItem.deleteMany();
    await Order.deleteMany();
    
    logger.info('Previous data cleared');
    
    // Insert customers
    const createdCustomers = await Customer.insertMany(customers);
    logger.info(`${createdCustomers.length} customers inserted`);
    
    // Insert categories
    const createdCategories = await ShopItemCategory.insertMany(categories);
    logger.info(`${createdCategories.length} categories inserted`);
    
    // Create shop items
    const shopItems = [
      {
        title: 'Smartphone',
        description: 'Latest model smartphone with high-end features',
        price: 699.99,
        categories: [createdCategories[0]._id] // Electronics
      },
      {
        title: 'Laptop',
        description: 'Powerful laptop for work and entertainment',
        price: 1299.99,
        categories: [createdCategories[0]._id] // Electronics
      },
      {
        title: 'T-shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        categories: [createdCategories[1]._id] // Clothing
      },
      {
        title: 'Jeans',
        description: 'Classic blue jeans',
        price: 49.99,
        categories: [createdCategories[1]._id] // Clothing
      },
      {
        title: 'Novel',
        description: 'Bestselling fiction novel',
        price: 12.99,
        categories: [createdCategories[2]._id] // Books
      },
      {
        title: 'Cookbook',
        description: 'Collection of recipes from around the world',
        price: 24.99,
        categories: [createdCategories[2]._id, createdCategories[3]._id] // Books, Home & Kitchen
      },
      {
        title: 'Blender',
        description: 'High-power kitchen blender',
        price: 89.99,
        categories: [createdCategories[3]._id] // Home & Kitchen
      }
    ];
    
    const createdShopItems = await ShopItem.insertMany(shopItems);
    logger.info(`${createdShopItems.length} shop items inserted`);
    
    // Create orders
    const orders = [
      {
        customer: createdCustomers[0]._id,
        items: [
          { shopItem: createdShopItems[0]._id, quantity: 1 },
          { shopItem: createdShopItems[4]._id, quantity: 2 }
        ]
      },
      {
        customer: createdCustomers[1]._id,
        items: [
          { shopItem: createdShopItems[2]._id, quantity: 3 },
          { shopItem: createdShopItems[3]._id, quantity: 1 }
        ]
      },
      {
        customer: createdCustomers[2]._id,
        items: [
          { shopItem: createdShopItems[1]._id, quantity: 1 },
          { shopItem: createdShopItems[6]._id, quantity: 1 }
        ]
      }
    ];
    
    const createdOrders = await Order.create(orders);
    logger.info(`${createdOrders.length} orders inserted`);
    
    logger.info('Seeding completed successfully');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error; // Re-throw the error so it can be caught by the caller
  }
};

// Run the seed function
seedData();