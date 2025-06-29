const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const { ShopItemCategory } = require('../../src/models');

let mongoServer;

// Set up the in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  app.close();
});

// Clean up database between tests
beforeEach(async () => {
  await ShopItemCategory.deleteMany({});
});

describe('Category API Routes', () => {
  const sampleCategory = {
    title: 'Test Category',
    description: 'Test category description'
  };

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send(sampleCategory);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toEqual(sampleCategory.title);
      expect(res.body.data.description).toEqual(sampleCategory.description);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ title: 'Test Category' }); // Missing description
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      // Create test categories
      await ShopItemCategory.create(sampleCategory);
      await ShopItemCategory.create({
        title: 'Another Category',
        description: 'Another category description'
      });

      const res = await request(app).get('/api/categories');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a single category by id', async () => {
      const category = await ShopItemCategory.create(sampleCategory);

      const res = await request(app).get(`/api/categories/${category._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data._id).toEqual(category._id.toString());
      expect(res.body.data.title).toEqual(category.title);
    });

    it('should return 404 if category not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/categories/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      const category = await ShopItemCategory.create(sampleCategory);
      const updatedData = {
        title: 'Updated Category',
        description: 'Updated category description'
      };

      const res = await request(app)
        .put(`/api/categories/${category._id}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.title).toEqual(updatedData.title);
      expect(res.body.data.description).toEqual(updatedData.description);
    });

    it('should return 404 if category not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/categories/${nonExistentId}`)
        .send(sampleCategory);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const category = await ShopItemCategory.create(sampleCategory);

      const res = await request(app).delete(`/api/categories/${category._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      
      // Verify category was deleted
      const deleted = await ShopItemCategory.findById(category._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 if category not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/categories/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });
});