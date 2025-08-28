from fastapi import APIRouter, HTTPException
from models.user import user_collection
from schemas.user import User, UserCreate, UserUpdate
from utils.auth import get_password_hash
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[User])
def get_users():
    users = list(user_collection.find())
    for u in users:
        u["id"] = str(u["_id"])
    return users

@router.get("/{user_id}", response_model=User)
def get_user(user_id: str):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])
    return user

@router.post("/", response_model=User)
def create_user(user: UserCreate):
    data = user.dict()
    password = data.pop("password")
    data["hashed_password"] = get_password_hash(password)
    result = user_collection.insert_one(data)
    new_user = user_collection.find_one({"_id": result.inserted_id})
    new_user["id"] = str(new_user["_id"])
    return new_user

@router.put("/{user_id}", response_model=User)
def update_user(user_id: str, user: UserUpdate):
    result = user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = user_collection.find_one({"_id": ObjectId(user_id)})
    updated_user["id"] = str(updated_user["_id"])
    return updated_user

@router.delete("/{user_id}")
def delete_user(user_id: str):
    result = user_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"} 