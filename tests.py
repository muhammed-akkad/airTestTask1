import unittest
import requests

BASE_URL = 'http://127.0.0.1:5000'

class TestAPI(unittest.TestCase):
    def test_get_customers(self):
        response = requests.get(f'{BASE_URL}/customers')
        self.assertEqual(response.status_code, 200)

    def test_post_customer(self):
        response = requests.post(f'{BASE_URL}/customers', json={
            'name': 'Jane', 'surname': 'Doe', 'email': 'jane.doe@example.com'
        })
        self.assertEqual(response.status_code, 201)

if __name__ == '__main__':
    unittest.main()
