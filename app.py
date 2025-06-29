from flask import Flask, request, jsonify
from database import init_db, db_session
from models import Customer, ShopItemCategory, ShopItem, Order, OrderItem

app = Flask(__name__)
init_db()

@app.route('/customers', methods=['GET', 'POST'])
def handle_customers():
    if request.method == 'GET':
        customers = db_session.query(Customer).all()
        return jsonify([customer.to_dict() for customer in customers])
    elif request.method == 'POST':
        data = request.json
        customer = Customer(name=data['name'], surname=data['surname'], email=data['email'])
        db_session.add(customer)
        db_session.commit()
        return jsonify(customer.to_dict()), 201

@app.route('/customers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_customer(id):
    customer = db_session.query(Customer).get(id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    if request.method == 'GET':
        return jsonify(customer.to_dict())
    elif request.method == 'PUT':
        data = request.json
        customer.name = data.get('name', customer.name)
        customer.surname = data.get('surname', customer.surname)
        customer.email = data.get('email', customer.email)
        db_session.commit()
        return jsonify(customer.to_dict())
    elif request.method == 'DELETE':
        db_session.delete(customer)
        db_session.commit()
        return jsonify({'message': 'Customer deleted'})

@app.route('/shopitemcategories', methods=['GET', 'POST'])
def handle_shopitemcategories():
    if request.method == 'GET':
        categories = db_session.query(ShopItemCategory).all()
        return jsonify([category.to_dict() for category in categories])
    elif request.method == 'POST':
        data = request.json
        category = ShopItemCategory(title=data['title'], description=data['description'])
        db_session.add(category)
        db_session.commit()
        return jsonify(category.to_dict()), 201

@app.route('/shopitemcategories/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_shopitemcategory(id):
    category = db_session.query(ShopItemCategory).get(id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    if request.method == 'GET':
        return jsonify(category.to_dict())
    elif request.method == 'PUT':
        data = request.json
        category.title = data.get('title', category.title)
        category.description = data.get('description', category.description)
        db_session.commit()
        return jsonify(category.to_dict())
    elif request.method == 'DELETE':
        db_session.delete(category)
        db_session.commit()
        return jsonify({'message': 'Category deleted'})

@app.route('/shopitems', methods=['GET', 'POST'])
def handle_shopitems():
    if request.method == 'GET':
        shop_items = db_session.query(ShopItem).all()
        return jsonify([shop_item.to_dict() for shop_item in shop_items])
    elif request.method == 'POST':
        data = request.json
        shop_item = ShopItem(title=data['title'], description=data['description'], price=data['price'])
        db_session.add(shop_item)
        db_session.commit()
        return jsonify(shop_item.to_dict()), 201

@app.route('/shopitems/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_shopitem(id):
    shop_item = db_session.query(ShopItem).get(id)
    if not shop_item:
        return jsonify({'error': 'Shop item not found'}), 404

    if request.method == 'GET':
        return jsonify(shop_item.to_dict())
    elif request.method == 'PUT':
        data = request.json
        shop_item.title = data.get('title', shop_item.title)
        shop_item.description = data.get('description', shop_item.description)
        shop_item.price = data.get('price', shop_item.price)
        db_session.commit()
        return jsonify(shop_item.to_dict())
    elif request.method == 'DELETE':
        db_session.delete(shop_item)
        db_session.commit()
        return jsonify({'message': 'Shop item deleted'})

@app.route('/orders', methods=['GET', 'POST'])
def handle_orders():
    if request.method == 'GET':
        orders = db_session.query(Order).all()
        return jsonify([order.to_dict() for order in orders])
    elif request.method == 'POST':
        data = request.json
        order = Order(customer_id=data['customer_id'])
        db_session.add(order)
        db_session.commit()
        return jsonify(order.to_dict()), 201

@app.route('/orders/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_order(id):
    order = db_session.query(Order).get(id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    if request.method == 'GET':
        return jsonify(order.to_dict())
    elif request.method == 'PUT':
        data = request.json
        order.customer_id = data.get('customer_id', order.customer_id)
        db_session.commit()
        return jsonify(order.to_dict())
    elif request.method == 'DELETE':
        db_session.delete(order)
        db_session.commit()
        return jsonify({'message': 'Order deleted'})

if __name__ == '__main__':
    app.run(debug=True)
