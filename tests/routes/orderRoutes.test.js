const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const { Order, Customer, ShopItem, ShopItemCategory } = require('../../src/models');

let mongoServer;
let testCustomer;
let testShopItem;

// Set up the in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  
  // Create a test customer to use in order tests
  testCustomer = await Customer.create({
    name: 'Test',
    surname: 'Customer',
    email: 'test.customer@example.com'
  });
  
  // Create a test category
  const testCategory = await ShopItemCategory.create({
    title: 'Test Category',
    description: 'Test category description'
  });
  
  // Create a test shop item to use in order tests
  testShopItem = await ShopItem.create({
    title: 'Test Item',
    description: 'Test item description',
    price: 99.99,
    categories: [testCategory._id]
  });
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  app.close();
});

// Clean up database between tests
beforeEach(async () => {
  await Order.deleteMany({});
});

describe('Order API Routes', () => {
  const sampleOrder = {
    customer: null, // Will be filled with testCustomer._id in beforeEach
    items: [] // Will be filled with testShopItem._id in beforeEach
  };

  beforeEach(() => {
    // Set the testCustomer._id and testShopItem._id for each test
    sampleOrder.customer = testCustomer._id;
    sampleOrder.items = [
      {
        shopItem: testShopItem._id,
        quantity: 2
      }
    ];
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send(sampleOrder);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.customer._id).toEqual(testCustomer._id.toString());
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].quantity).toEqual(2);
      expect(res.body.data.items[0].shopItem._id).toEqual(testShopItem._id.toString());
      expect(res.body.data).toHaveProperty('totalPrice');
    });

    it('should return 404 if customer does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const invalidOrder = {
        ...sampleOrder,
        customer: nonExistentId
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });

    it('should return 404 if shop item does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const invalidOrder = {
        ...sampleOrder,
        items: [
          {
            shopItem: nonExistentId,
            quantity: 2
          }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });

    it('should return 400 if item quantity is invalid', async () => {
      const invalidOrder = {
        ...sampleOrder,
        items: [
          {
            shopItem: testShopItem._id,
            quantity: 0 // Invalid quantity
          }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .send(invalidOrder);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders with populated fields', async () => {
      // Create test orders
      await Order.create(sampleOrder);
      await Order.create(sampleOrder); // Create a second order
      
      const res = await request(app).get('/api/orders');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].customer).toHaveProperty('name');
      expect(res.body.data[0].items[0].shopItem).toHaveProperty('title');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return a single order by id with populated fields', async () => {
      const order = await Order.create(sampleOrder);

      const res = await request(app).get(`/api/orders/${order._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data._id).toEqual(order._id.toString());
      expect(res.body.data.customer).toHaveProperty('name');
      expect(res.body.data.items[0].shopItem).toHaveProperty('title');
    });

    it('should return 404 if order not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/orders/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should update an order', async () => {
      const order = await Order.create(sampleOrder);
      const updatedData = {
        ...sampleOrder,
        items: [
          {
            shopItem: testShopItem._id,
            quantity: 5 // Updated quantity
          }
        ]
      };

      const res = await request(app)
        .put(`/api/orders/${order._id}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.items[0].quantity).toEqual(5);
    });

    it('should return 404 if order not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/orders/${nonExistentId}`)
        .send(sampleOrder);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });

    it('should return 404 if customer does not exist when updating', async () => {
      const order = await Order.create(sampleOrder);
      const nonExistentId = new mongoose.Types.ObjectId();
      const invalidUpdate = {
        ...sampleOrder,
        customer: nonExistentId
      };

      const res = await request(app)
        .put(`/api/orders/${order._id}`)
        .send(invalidUpdate);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete an order', async () => {
      const order = await Order.create(sampleOrder);

      const res = await request(app).delete(`/api/orders/${order._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      
      // Verify order was deleted
      const deleted = await Order.findById(order._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 if order not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/orders/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });
});