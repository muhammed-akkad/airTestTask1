const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const { Customer } = require('../../src/models');
const connectDB = require('../../src/config/db');

let mongoServer;

// Set up the in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await connectDB(); // Ensure database connection is established
});

// Clean up after tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Clean up database between tests
beforeEach(async () => {
  await Customer.deleteMany({});
});

describe('Customer API Routes', () => {
  const sampleCustomer = {
    name: 'Test',
    surname: 'User',
    email: 'test.user@example.com'
  };

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const res = await request(app)
        .post('/api/customers')
        .send(sampleCustomer);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toEqual(sampleCustomer.name);
      expect(res.body.data.surname).toEqual(sampleCustomer.surname);
      expect(res.body.data.email).toEqual(sampleCustomer.email);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/customers')
        .send({ name: 'Test' }); // Missing surname and email
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      // Create test customers
      await Customer.create(sampleCustomer);
      await Customer.create({
        name: 'Another',
        surname: 'User',
        email: 'another.user@example.com'
      });

      const res = await request(app).get('/api/customers');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a single customer by id', async () => {
      const customer = await Customer.create(sampleCustomer);

      const res = await request(app).get(`/api/customers/${customer._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data._id).toEqual(customer._id.toString());
      expect(res.body.data.name).toEqual(customer.name);
    });

    it('should return 404 if customer not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/customers/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update a customer', async () => {
      const customer = await Customer.create(sampleCustomer);
      const updatedData = {
        name: 'Updated',
        surname: 'Person',
        email: 'updated.person@example.com'
      };

      const res = await request(app)
        .put(`/api/customers/${customer._id}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.name).toEqual(updatedData.name);
      expect(res.body.data.surname).toEqual(updatedData.surname);
      expect(res.body.data.email).toEqual(updatedData.email);
    });

    it('should return 404 if customer not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/customers/${nonExistentId}`)
        .send(sampleCustomer);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should delete a customer', async () => {
      const customer = await Customer.create(sampleCustomer);

      const res = await request(app).delete(`/api/customers/${customer._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      
      // Verify customer was deleted
      const deleted = await Customer.findById(customer._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 if customer not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/customers/${nonExistentId}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBeFalsy();
    });
  });
});