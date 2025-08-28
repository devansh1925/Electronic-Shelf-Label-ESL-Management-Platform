from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    assignedStores: List[str]
    status: str
    avatar: Optional[str] = None
    lastLogin: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    pass

class UserInDB(UserBase):
    id: str

class User(UserInDB):
    pass 