from database.mongo import db
from datetime import datetime

# Get the categories collection
category_collection = db["categories"]

# Create indexes for better performance
def create_category_indexes():
    category_collection.create_index("name", unique=True)
    category_collection.create_index("is_active")

# Initialize default categories
def initialize_default_categories():
    default_categories = [
        {"name": "Beverages", "description": "Drinks and beverages", "is_active": True},
        {"name": "Dairy", "description": "Dairy products", "is_active": True},
        {"name": "Bakery", "description": "Baked goods", "is_active": True},
        {"name": "Fruits", "description": "Fresh fruits", "is_active": True},
        {"name": "Snacks", "description": "Snack foods", "is_active": True},
        {"name": "Vegetables", "description": "Fresh vegetables", "is_active": True},
        {"name": "Meat", "description": "Meat and poultry", "is_active": True},
        {"name": "Frozen Foods", "description": "Frozen food items", "is_active": True},
        {"name": "Pantry", "description": "Pantry staples", "is_active": True},
        {"name": "Personal Care", "description": "Personal care products", "is_active": True},
    ]
    
    for category in default_categories:
        # Check if category already exists
        existing = category_collection.find_one({"name": category["name"]})
        if not existing:
            category["created_at"] = datetime.utcnow()
            category["updated_at"] = datetime.utcnow()
            category_collection.insert_one(category) 