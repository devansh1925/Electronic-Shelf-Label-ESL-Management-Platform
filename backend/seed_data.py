from database.mongo import db
from models.store import store_collection
from models.product import product_collection
from models.esl import esl_collection

def seed_data():
    # Clear existing data
    store_collection.delete_many({})
    product_collection.delete_many({})
    esl_collection.delete_many({})
    
    # Sample stores
    stores = [
        {
            "name": "Store #001",
            "location": "Downtown Mall",
            "manager": "John Smith",
            "eslCount": 25,
            "status": "active",
            "lastSync": "2024-01-15T10:30:00Z"
        },
        {
            "name": "Store #002", 
            "location": "Westside Plaza",
            "manager": "Sarah Johnson",
            "eslCount": 18,
            "status": "active",
            "lastSync": "2024-01-15T09:45:00Z"
        },
        {
            "name": "Store #003",
            "location": "Eastside Center",
            "manager": "Mike Davis",
            "eslCount": 32,
            "status": "active",
            "lastSync": "2024-01-15T11:15:00Z"
        }
    ]
    
    # Sample products
    products = [
        {
            "name": "Premium Coffee Beans",
            "barcode": "1234567890123",
            "mrp": 15.99,
            "discount": 2.00,
            "sellingPrice": 13.99,
            "category": "Beverages"
        },
        {
            "name": "Organic Milk",
            "barcode": "9876543210987",
            "mrp": 4.99,
            "discount": 1.00,
            "sellingPrice": 3.99,
            "category": "Dairy"
        },
        {
            "name": "Whole Wheat Bread",
            "barcode": "4567891234567",
            "mrp": 3.99,
            "discount": 1.00,
            "sellingPrice": 2.99,
            "category": "Bakery"
        },
        {
            "name": "Fresh Apples",
            "barcode": "7891234567890",
            "mrp": 2.99,
            "discount": 0.50,
            "sellingPrice": 2.49,
            "category": "Produce"
        },
        {
            "name": "Greek Yogurt",
            "barcode": "3216549873210",
            "mrp": 5.99,
            "discount": 1.00,
            "sellingPrice": 4.99,
            "category": "Dairy"
        }
    ]
    
    # Sample ESLs
    esls = [
        {
            "labelSize": "2.9 inch",
            "batteryLevel": 85,
            "signalStrength": 92,
            "status": "active",
            "productName": "Premium Coffee Beans",
            "storeName": "Store #001",
            "lastSync": "2 min ago",
            "isRecentlySync": True
        },
        {
            "labelSize": "4.2 inch",
            "batteryLevel": 23,
            "signalStrength": 67,
            "status": "active",
            "productName": "Organic Milk",
            "storeName": "Store #001",
            "lastSync": "15 min ago",
            "isRecentlySync": False
        },
        {
            "labelSize": "2.9 inch",
            "batteryLevel": 0,
            "signalStrength": 0,
            "status": "error",
            "productName": "Whole Wheat Bread",
            "storeName": "Store #002",
            "lastSync": "2 hours ago",
            "isRecentlySync": False
        },
        {
            "labelSize": "7.5 inch",
            "batteryLevel": 67,
            "signalStrength": 88,
            "status": "inactive",
            "productName": "Fresh Apples",
            "storeName": "Store #002",
            "lastSync": "1 hour ago",
            "isRecentlySync": False
        },
        {
            "labelSize": "4.2 inch",
            "batteryLevel": 91,
            "signalStrength": 95,
            "status": "active",
            "productName": "Greek Yogurt",
            "storeName": "Store #003",
            "lastSync": "30 sec ago",
            "isRecentlySync": True
        }
    ]
    
    # Insert data
    store_collection.insert_many(stores)
    product_collection.insert_many(products)
    esl_collection.insert_many(esls)
    
    print(f"Inserted {len(stores)} stores")
    print(f"Inserted {len(products)} products")
    print(f"Inserted {len(esls)} ESLs")
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data() 