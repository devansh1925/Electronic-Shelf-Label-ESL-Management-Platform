# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from app.core.config import MONGO_URL


client = AsyncIOMotorClient(MONGO_URL, server_api=ServerApi("1"))
db = client["esl_management_system"]
