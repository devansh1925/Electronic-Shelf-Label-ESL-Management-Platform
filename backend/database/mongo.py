from pymongo import MongoClient
from config.settings import settings
from urllib.parse import urlparse

client = MongoClient(settings.MONGO_URL, serverSelectionTimeoutMS=5000)

parsed = urlparse(settings.MONGO_URL)
if parsed.path and parsed.path != "/":
    db_name = parsed.path[1:]
else:
    db_name = "esl_management"

db = client[db_name]

try:
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}") 