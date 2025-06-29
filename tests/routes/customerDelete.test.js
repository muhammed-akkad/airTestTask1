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

describe('Customer Deletion API', () => {
  const sampleCustomers = [
    {
      name: 'Test1',
      surname: 'User1',
      email: 'test1.user@example.com'
    },
    {
      name: 'Test2',
      surname: 'User2',
      email: 'test2.user@example.com'
    },
    {
      name: 'Test3',
      surname: 'User3',
      email: 'test3.user@example.com'
    }
  ];

  beforeEach(async () => {
    // Clear all customers before each test
    await Customer.deleteMany({});
  });

  describe('DELETE /api/customers (bulk deletion)', () => {
    it('should delete all customers', async () => {
      // Create multiple test customers
      await Customer.insertMany(sampleCustomers);
      
      // Verify customers were created
      const customersBeforeDelete = await Customer.find({});
      expect(customersBeforeDelete).toHaveLength(3);
      
      // Delete all customers
      const res = await request(app)
        .delete('/api/customers');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      
      // Verify all customers were deleted
      const customersAfterDelete = await Customer.find({});
      expect(customersAfterDelete).toHaveLength(0);
    });

    it('should work when no customers exist', async () => {
      // Make sure no customers exist
      const customersBeforeDelete = await Customer.find({});
      expect(customersBeforeDelete).toHaveLength(0);
      
      // Try to delete all customers
      const res = await request(app)
        .delete('/api/customers');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      
      // Verify no customers exist after operation
      const customersAfterDelete = await Customer.find({});
      expect(customersAfterDelete).toHaveLength(0);
    });
  });
});