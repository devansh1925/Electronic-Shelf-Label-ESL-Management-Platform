from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Literal["admin", "manager"]


class UserResponse(BaseModel):
    _id: str
    email: EmailStr
    role: str
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
