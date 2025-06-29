# Online Shop Backend

## Description

This project is a minimalistic backend web application for an online shop. It provides full CRUD APIs for managing the following entities:
- **Customer**
- **ShopItemCategory**
- **ShopItem**
- **Order**

The application uses SQLite for data persistence and includes endpoint autotests.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Task\ 1
   ```

2. Install dependencies:
   ```bash
   pip install flask sqlalchemy requests
   ```

3. Initialize the database:
   ```bash
   python -c "from database import init_db; init_db()"
   ```

## Run the Application

Start the Flask server:
```bash
python app.py
```

The server will run at `http://127.0.0.1:5000`.

## API Endpoints

### Customer
- `GET /customers`: Retrieve all customers.
- `POST /customers`: Create a new customer.
- `GET /customers/<id>`: Retrieve a specific customer by ID.
- `PUT /customers/<id>`: Update a specific customer by ID.
- `DELETE /customers/<id>`: Delete a specific customer by ID.

### ShopItemCategory
- `GET /shopitemcategories`: Retrieve all categories.
- `POST /shopitemcategories`: Create a new category.
- `GET /shopitemcategories/<id>`: Retrieve a specific category by ID.
- `PUT /shopitemcategories/<id>`: Update a specific category by ID.
- `DELETE /shopitemcategories/<id>`: Delete a specific category by ID.

### ShopItem
- `GET /shopitems`: Retrieve all shop items.
- `POST /shopitems`: Create a new shop item.
- `GET /shopitems/<id>`: Retrieve a specific shop item by ID.
- `PUT /shopitems/<id>`: Update a specific shop item by ID.
- `DELETE /shopitems/<id>`: Delete a specific shop item by ID.

### Order
- `GET /orders`: Retrieve all orders.
- `POST /orders`: Create a new order.
- `GET /orders/<id>`: Retrieve a specific order by ID.
- `PUT /orders/<id>`: Update a specific order by ID.
- `DELETE /orders/<id>`: Delete a specific order by ID.

## Run Tests

Run the endpoint tests:
```bash
python tests.py
```

## Example Test Data

The database is initialized with the following test data:
- **Customer**: John Doe (`john.doe@example.com`)
- **ShopItemCategory**: Electronics
- **ShopItem**: Laptop (`$999.99`)

## Notes

- Ensure the Flask server is running before executing tests.
- Modify the `BASE_URL` in `tests.py` if the server runs on a different host or port.