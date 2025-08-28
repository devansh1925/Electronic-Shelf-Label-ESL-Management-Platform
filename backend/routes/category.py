from fastapi import APIRouter, HTTPException
from models.category import category_collection, create_category_indexes, initialize_default_categories
from schemas.category import Category, CategoryCreate, CategoryUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=list[Category])
def get_categories(active_only: bool = False):
    """Get all categories, optionally filtered by active status"""
    try:
        filter_query = {"is_active": True} if active_only else {}
        categories = list(category_collection.find(filter_query).sort("name", 1))
        
        # Convert MongoDB documents to proper format
        formatted_categories = []
        for category in categories:
            category["id"] = str(category["_id"])
            del category["_id"]  # Remove the original _id field
            formatted_categories.append(category)
        
        return formatted_categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")

@router.get("/{category_id}", response_model=Category)
def get_category(category_id: str):
    """Get a specific category by ID"""
    try:
        if not ObjectId.is_valid(category_id):
            raise HTTPException(status_code=400, detail="Invalid category ID")
        
        category = category_collection.find_one({"_id": ObjectId(category_id)})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        category["id"] = str(category["_id"])
        del category["_id"]  # Remove the original _id field
        return category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch category: {str(e)}")

@router.post("/", response_model=Category)
def create_category(category: CategoryCreate):
    """Create a new category"""
    try:
        # Check if category with same name already exists
        existing = category_collection.find_one({"name": category.name})
        if existing:
            raise HTTPException(status_code=400, detail="Category with this name already exists")
        
        category_data = category.dict()
        category_data["created_at"] = datetime.utcnow()
        category_data["updated_at"] = datetime.utcnow()
        
        result = category_collection.insert_one(category_data)
        new_category = category_collection.find_one({"_id": result.inserted_id})
        new_category["id"] = str(new_category["_id"])
        del new_category["_id"]
        
        return new_category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create category: {str(e)}")

@router.put("/{category_id}", response_model=Category)
def update_category(category_id: str, category: CategoryUpdate):
    """Update an existing category"""
    try:
        if not ObjectId.is_valid(category_id):
            raise HTTPException(status_code=400, detail="Invalid category ID")
        
        # Check if category exists
        existing = category_collection.find_one({"_id": ObjectId(category_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Check if new name conflicts with existing category
        if category.name:
            name_conflict = category_collection.find_one({
                "name": category.name,
                "_id": {"$ne": ObjectId(category_id)}
            })
            if name_conflict:
                raise HTTPException(status_code=400, detail="Category with this name already exists")
        
        update_data = category.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        result = category_collection.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="No changes made to category")
        
        # Return updated category
        updated = category_collection.find_one({"_id": ObjectId(category_id)})
        updated["id"] = str(updated["_id"])
        del updated["_id"]
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update category: {str(e)}")

@router.delete("/{category_id}")
def delete_category(category_id: str):
    """Delete a category (soft delete by setting is_active to False)"""
    try:
        if not ObjectId.is_valid(category_id):
            raise HTTPException(status_code=400, detail="Invalid category ID")
        
        # Check if category exists
        existing = category_collection.find_one({"_id": ObjectId(category_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Soft delete by setting is_active to False
        result = category_collection.update_one(
            {"_id": ObjectId(category_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to delete category")
        
        return {"message": "Category deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete category: {str(e)}")

@router.post("/initialize")
def initialize_categories():
    """Initialize default categories (admin only)"""
    try:
        create_category_indexes()
        initialize_default_categories()
        return {"message": "Default categories initialized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize categories: {str(e)}") 