from jose import jwt, JWTError
from datetime import datetime
from app.core.config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + ACCESS_TOKEN_EXPIRE
    to_encode.update({"exp": expire})
    jwt_token = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

    return jwt_token


def verify_token(token: str):
    try:
        return jwt.decode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    except:
        return None
