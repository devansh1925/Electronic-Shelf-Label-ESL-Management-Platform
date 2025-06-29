from app.db.database import db
from datetime import datetime
from fastapi import HTTPException

user_collection = db["users"]


async def create_user(user_data: dict) -> dict:
    try:
        now = datetime.utcnow()
        user_data["created_at"] = now
        user_data["updated_at"] = now

        result = await user_collection.insert_one(user_data)

        user = await user_collection.find_one({"_id": result.inserted_id})

        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "created_at": user["created_at"],
            "updated_at": user["updated_at"],
        }
    except:
        raise HTTPException(
            status_code=500, detail="Something went wrong in creating a user"
        )
