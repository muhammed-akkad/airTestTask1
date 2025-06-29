const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const { ShopItem, ShopItemCategory } = require('../../src/models');

let mongoServer;
let testCategory;

// Set up the in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  
  // Create a test category to use in item tests
  testCategory = await ShopItemCategory.create({
    title: 'Test Category',
    description: 'Test category description'
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
  await ShopItem.deleteMany({});
});

describe('ShopItem API Routes', () => {
  const sampleShopItem = {
    title: 'Test Item',
    description: 'Test item description',
    price: 99.99,
    categories: [] // Will be filled with testCategory._id in beforeEach
  };

  beforeEach(() => {
    // Set the testCategory._id for each test
    sampleShopItem.categories = [testCategory._id];
  });

  describe('POST /api/items', () => {
    it('should create a new shop item', async () => {
      const res = await request(app)
        .post('/api/items')
        .send(sampleShopItem);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toEqual(sampleShopItem.title);
      expect(res.body.data.description).toEqual(sampleShopItem.description);
      expect(res.body.data.price).toEqual(sampleShopItem.price);
      expect(res.body.data.categories).toHaveLength(1);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/items')
        .send({ title: 'Test Item' }); // Missing description, price, categories
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });

    it('should return 400 if category does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const invalidItem = {
        ...sampleShopItem,
        categories: [nonExistentId]
      };

      const res = await request(app)
        .post('/api/items')
        .send(invalidItem);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('GET /api/items', () => {
    it('should return all shop items with populated categories', async () => {
      // Create test items
      await ShopItem.create(sampleShopItem);
      await ShopItem.create({
        title: 'Another Item',
        description: 'Another item description',
        price: 49.99,
        categories: [testCategory._id]
      });

      const res = await request(app).get('/api/items');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].categories[0]).toHaveProperty('title');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a single shop item by id with populated categories', async () => {
      const shopItem = await ShopItem.create(sampleShopItem);

      const res = await request(app).get(`/api/items/${shopItem._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data._id).toEqual(shopItem._id.toString());
      expect(res.body.data.title).toEqual(shopItem.title);
      expect(res.body.data.categories[0]).toHaveProperty('title');
    });

    it('should return 404 if shop item not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/items/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update a shop item', async () => {
      const shopItem = await ShopItem.create(sampleShopItem);
      const updatedData = {
        title: 'Updated Item',
        description: 'Updated item description',
        price: 129.99,
        categories: [testCategory._id]
      };

      const res = await request(app)
        .put(`/api/items/${shopItem._id}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.title).toEqual(updatedData.title);
      expect(res.body.data.description).toEqual(updatedData.description);
      expect(res.body.data.price).toEqual(updatedData.price);
    });

    it('should return 404 if shop item not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/items/${nonExistentId}`)
        .send(sampleShopItem);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });

    it('should return 400 if category does not exist', async () => {
      const shopItem = await ShopItem.create(sampleShopItem);
      const nonExistentId = new mongoose.Types.ObjectId();
      const invalidUpdate = {
        ...sampleShopItem,
        categories: [nonExistentId]
      };

      const res = await request(app)
        .put(`/api/items/${shopItem._id}`)
        .send(invalidUpdate);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete a shop item', async () => {
      const shopItem = await ShopItem.create(sampleShopItem);

      const res = await request(app).delete(`/api/items/${shopItem._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      
      // Verify shop item was deleted
      const deleted = await ShopItem.findById(shopItem._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 if shop item not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/items/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });
});