import unittest
import requests
import json
from datetime import datetime, timedelta

class TestCostManagerAPI(unittest.TestCase):
    BASE_URL = "http://localhost:3000/api"  # Change this to your API's base URL
    TEST_USER_ID = "123123"

    def setUp(self):
        """Set up test case - runs before each test"""
        # You might want to add setup logic here, like ensuring test user exists
        self.test_cost = {
            "description": "Test cost",
            "category": "food",
            "sum": 100,
            "userid": self.TEST_USER_ID
        }

    def test_about_endpoint(self):
        """Test GET /api/about endpoint"""
        response = requests.get(f"{self.BASE_URL}/about")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify response is a list of developers
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)
        
        # Check each developer has required fields only
        for developer in data:
            self.assertIn('first_name', developer)
            self.assertIn('last_name', developer)
            self.assertEqual(len(developer.keys()), 2)

    def test_get_user_details(self):
        """Test GET /api/users/:id endpoint"""
        # Test existing user
        response = requests.get(f"{self.BASE_URL}/users/{self.TEST_USER_ID}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify response structure
        self.assertIn('id', data)
        self.assertIn('first_name', data)
        self.assertIn('last_name', data)
        self.assertIn('total', data)
        
        # Test non-existing user
        response = requests.get(f"{self.BASE_URL}/users/999999")
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_add_cost(self):
        """Test POST /api/add endpoint"""
        # Test adding valid cost
        response = requests.post(
            f"{self.BASE_URL}/add",
            json=self.test_cost
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        
        # Verify response contains all cost details
        self.assertEqual(data['description'], self.test_cost['description'])
        self.assertEqual(data['category'], self.test_cost['category'])
        self.assertEqual(data['sum'], self.test_cost['sum'])
        self.assertEqual(data['userid'], self.test_cost['userid'])

        # Test invalid category
        invalid_cost = self.test_cost.copy()
        invalid_cost['category'] = 'invalid_category'
        response = requests.post(
            f"{self.BASE_URL}/add",
            json=invalid_cost
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

        # Test negative sum
        negative_cost = self.test_cost.copy()
        negative_cost['sum'] = -100
        response = requests.post(
            f"{self.BASE_URL}/add",
            json=negative_cost
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

        # Test missing required fields
        response = requests.post(
            f"{self.BASE_URL}/add",
            json={"description": "Test cost"}
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_monthly_report(self):
        """Test GET /api/report endpoint"""
        # Add some test costs first
        test_costs = [
            {
                "description": "Groceries",
                "category": "food",
                "sum": 100,
                "userid": self.TEST_USER_ID
            },
            {
                "description": "Gym",
                "category": "sport",
                "sum": 200,
                "userid": self.TEST_USER_ID
            },
            {
                "description": "Rent",
                "category": "housing",
                "sum": 1000,
                "userid": self.TEST_USER_ID
            }
        ]
        
        for cost in test_costs:
            requests.post(f"{self.BASE_URL}/add", json=cost)

        # Test getting report
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        response = requests.get(
            f"{self.BASE_URL}/report",
            params={
                "id": self.TEST_USER_ID,
                "year": current_year,
                "month": current_month
            }
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify report structure
        self.assertEqual(data['userid'], self.TEST_USER_ID)
        self.assertEqual(data['year'], current_year)
        self.assertEqual(data['month'], current_month)
        self.assertIsInstance(data['costs'], list)
        
        # Verify all categories are present
        categories = set()
        for cost_category in data['costs']:
            category = list(cost_category.keys())[0]
            categories.add(category)
        
        expected_categories = {'food', 'health', 'housing', 'sport', 'education'}
        self.assertEqual(categories, expected_categories)

        # Test invalid month
        response = requests.get(
            f"{self.BASE_URL}/report",
            params={
                "id": self.TEST_USER_ID,
                "year": current_year,
                "month": 13
            }
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_error_handling(self):
        """Test various error conditions"""
        # Test malformed JSON
        response = requests.post(
            f"{self.BASE_URL}/add",
            data="{'malformed': 'json'",
            headers={'Content-Type': 'application/json'}
        )
        self.assertEqual(response.status_code, 400)
        
        # Test missing parameters in report
        response = requests.get(f"{self.BASE_URL}/report")
        self.assertEqual(response.status_code, 400)
        
        # Test invalid user ID format
        response = requests.get(f"{self.BASE_URL}/users/invalid_id")
        self.assertEqual(response.status_code, 404)

    def test_report_date_filtering(self):
        """Test that report correctly filters by date"""
        # Add a cost for next month
        next_month = datetime.now() + timedelta(days=32)
        future_cost = {
            "description": "Future cost",
            "category": "food",
            "sum": 150,
            "userid": self.TEST_USER_ID,
            "created_at": next_month.isoformat()
        }
        
        requests.post(f"{self.BASE_URL}/add", json=future_cost)
        
        # Get current month's report
        current_year = datetime.now().year
        current_month = datetime.now().month
        
        response = requests.get(
            f"{self.BASE_URL}/report",
            params={
                "id": self.TEST_USER_ID,
                "year": current_year,
                "month": current_month
            }
        )
        
        data = response.json()
        food_costs = next(
            category['food'] 
            for category in data['costs'] 
            if 'food' in category
        )
        
        # Verify future cost is not in current month's report
        future_cost_present = any(
            cost['description'] == "Future cost" 
            for cost in food_costs
        )
        self.assertFalse(future_cost_present)

def run_tests():
    """Run all tests"""
    unittest.main(argv=[''], verbosity=2)

if __name__ == '__main__':
    run_tests()