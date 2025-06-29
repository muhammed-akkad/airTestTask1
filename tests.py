import unittest
import requests

BASE_URL = 'http://127.0.0.1:5000'

class TestAPI(unittest.TestCase):
    # Customer tests
    def test_get_customers(self):
        response = requests.get(f'{BASE_URL}/customers')
        self.assertEqual(response.status_code, 200)

    def test_post_customer(self):
        response = requests.post(f'{BASE_URL}/customers', json={
            'name': 'Jane', 'surname': 'Doe', 'email': 'jane.doe@example.com'
        })
        self.assertEqual(response.status_code, 201)

    def test_get_customer_by_id(self):
        response = requests.get(f'{BASE_URL}/customers/1')
        self.assertEqual(response.status_code, 200)

    def test_put_customer(self):
        response = requests.put(f'{BASE_URL}/customers/1', json={
            'name': 'John Updated', 'surname': 'Doe Updated'
        })
        self.assertEqual(response.status_code, 200)

    def test_delete_customer(self):
        response = requests.delete(f'{BASE_URL}/customers/1')
        self.assertEqual(response.status_code, 200)

    # ShopItemCategory tests
    def test_get_shopitemcategories(self):
        response = requests.get(f'{BASE_URL}/shopitemcategories')
        self.assertEqual(response.status_code, 200)

    def test_post_shopitemcategory(self):
        response = requests.post(f'{BASE_URL}/shopitemcategories', json={
            'title': 'Books', 'description': 'Various books'
        })
        self.assertEqual(response.status_code, 201)

    def test_get_shopitemcategory_by_id(self):
        response = requests.get(f'{BASE_URL}/shopitemcategories/1')
        self.assertEqual(response.status_code, 200)

    def test_put_shopitemcategory(self):
        response = requests.put(f'{BASE_URL}/shopitemcategories/1', json={
            'title': 'Updated Electronics', 'description': 'Updated description'
        })
        self.assertEqual(response.status_code, 200)

    def test_delete_shopitemcategory(self):
        response = requests.delete(f'{BASE_URL}/shopitemcategories/1')
        self.assertEqual(response.status_code, 200)

    # ShopItem tests
    def test_get_shopitems(self):
        response = requests.get(f'{BASE_URL}/shopitems')
        self.assertEqual(response.status_code, 200)

    def test_post_shopitem(self):
        response = requests.post(f'{BASE_URL}/shopitems', json={
            'title': 'Smartphone', 'description': 'Latest model', 'price': 799.99
        })
        self.assertEqual(response.status_code, 201)

    def test_get_shopitem_by_id(self):
        response = requests.get(f'{BASE_URL}/shopitems/1')
        self.assertEqual(response.status_code, 200)

    def test_put_shopitem(self):
        response = requests.put(f'{BASE_URL}/shopitems/1', json={
            'title': 'Updated Laptop', 'price': 899.99
        })
        self.assertEqual(response.status_code, 200)

    def test_delete_shopitem(self):
        response = requests.delete(f'{BASE_URL}/shopitems/1')
        self.assertEqual(response.status_code, 200)

    # Order tests
    def test_get_orders(self):
        response = requests.get(f'{BASE_URL}/orders')
        self.assertEqual(response.status_code, 200)

    def test_post_order(self):
        response = requests.post(f'{BASE_URL}/orders', json={
            'customer_id': 1
        })
        self.assertEqual(response.status_code, 201)

    def test_get_order_by_id(self):
        response = requests.get(f'{BASE_URL}/orders/1')
        self.assertEqual(response.status_code, 200)

    def test_put_order(self):
        response = requests.put(f'{BASE_URL}/orders/1', json={
            'customer_id': 2
        })
        self.assertEqual(response.status_code, 200)

    def test_delete_order(self):
        response = requests.delete(f'{BASE_URL}/orders/1')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
