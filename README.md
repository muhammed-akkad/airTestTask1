# Online Shop Backend

A minimalistic backend web app for an online shop with RESTful CRUD APIs for customers, shop item categories, shop items, and orders.

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd online-shop-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/online-shop
     NODE_ENV=development
     ```
   - Adjust the `MONGODB_URI` as needed for your MongoDB setup

## Running the Application

1. Start the server:
   ```
   npm start
   ```

2. For development with auto-reload:
   ```
   npm run dev
   ```

3. The server will start on the port specified in the `.env` file (default: 3000)
   - API will be available at: `http://localhost:3000/api`
   - Health check endpoint: `http://localhost:3000/health`

## Seeding Data

To populate the database with initial test data:

```
npm run seed
```

This will create sample customers, categories, shop items, and orders.

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a specific customer
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Shop Item Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Shop Items
- `GET /api/items` - Get all shop items
- `GET /api/items/:id` - Get a specific shop item
- `POST /api/items` - Create a new shop item
- `PUT /api/items/:id` - Update a shop item
- `DELETE /api/items/:id` - Delete a shop item

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

## Running Tests

To run all tests:

```
npm test
```

This will run the full test suite using Jest, including all API endpoint tests.

## Project Structure

- `src/` - Source code
  - `config/` - Configuration files for database, logging, etc.
  - `controllers/` - Request handlers for each route
  - `middleware/` - Express middleware (error handling, logging, etc.)
  - `models/` - Mongoose data models
  - `routes/` - API route definitions
  - `utils/` - Utility functions and helpers
  - `server.js` - Express application setup
- `tests/` - Test files
- `logs/` - Application logs

## Data Models

### Customer
- ID (automatically generated)
- Name (string, required)
- Surname (string, required)
- Email (string, required, unique)

### ShopItemCategory
- ID (automatically generated)
- Title (string, required)
- Description (string, required)

### ShopItem
- ID (automatically generated)
- Title (string, required)
- Description (string, required)
- Price (float, required)
- Categories (list of ShopItemCategory references)

### OrderItem
- ID (automatically generated)
- ShopItem (reference to ShopItem)
- Quantity (integer, required, min: 1)

### Order
- ID (automatically generated)
- Customer (reference to Customer)
- Items (list of OrderItem objects)
- TotalPrice (float, calculated)
- Status (string: pending, processing, shipped, delivered)
- Timestamps (createdAt, updatedAt)