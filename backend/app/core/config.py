import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))


ACCESS_TOKEN_EXPIRE = timedelta(minutes=JWT_EXPIRE_MINUTES)
