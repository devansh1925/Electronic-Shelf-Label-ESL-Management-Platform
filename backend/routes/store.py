from fastapi import APIRouter, HTTPException
from models.store import store_collection
from schemas.store import Store, StoreCreate, StoreUpdate
from bson import ObjectId

router = APIRouter(prefix="/stores", tags=["Stores"])

@router.get("/", response_model=list[Store])
def get_stores():
    stores = list(store_collection.find())
    for s in stores:
        s["id"] = str(s["_id"])
        # Remove the _id field to avoid conflicts with the response model
        s.pop("_id", None)
        # Ensure managerId field exists (for backward compatibility)
        if "managerId" not in s:
            import re
            manager_name = s.get("manager", "unknown")
            s["managerId"] = f"mgr-{re.sub(r'[^a-zA-Z0-9]', '', manager_name.lower())[:8]}-{str(hash(manager_name))[-4:]}"
    return stores

@router.get("/{store_id}", response_model=Store)
def get_store(store_id: str):
    try:
        object_id = ObjectId(store_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid store ID format")
    
    store = store_collection.find_one({"_id": object_id})
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    store["id"] = str(store["_id"])
    # Remove the _id field to avoid conflicts with the response model
    store.pop("_id", None)
    # Ensure managerId field exists (for backward compatibility)
    if "managerId" not in store:
        import re
        manager_name = store.get("manager", "unknown")
        store["managerId"] = f"mgr-{re.sub(r'[^a-zA-Z0-9]', '', manager_name.lower())[:8]}-{str(hash(manager_name))[-4:]}"
    return store

@router.post("/", response_model=Store)
def create_store(store: StoreCreate):
    # Auto-generate managerId based on manager name
    import re
    manager_id = f"mgr-{re.sub(r'[^a-zA-Z0-9]', '', store.manager.lower())[:8]}-{str(hash(store.manager))[-4:]}"
    
    store_data = store.model_dump()
    store_data["managerId"] = manager_id
    
    result = store_collection.insert_one(store_data)
    new_store = store_collection.find_one({"_id": result.inserted_id})
    new_store["id"] = str(new_store["_id"])
    # Remove the _id field to avoid conflicts with the response model
    new_store.pop("_id", None)
    return new_store

@router.put("/{store_id}", response_model=Store)
def update_store(store_id: str, store: StoreUpdate):
    try:
        # Validate ObjectId format
        object_id = ObjectId(store_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid store ID format")
    
    # Get the current store data to check if manager has changed
    current_store = store_collection.find_one({"_id": object_id})
    if not current_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Prepare update data
    update_data = store.model_dump(exclude_unset=True)
    
    # If manager is being updated, regenerate managerId
    if "manager" in update_data and update_data["manager"]:
        import re
        manager_id = f"mgr-{re.sub(r'[^a-zA-Z0-9]', '', update_data['manager'].lower())[:8]}-{str(hash(update_data['manager']))[-4:]}"
        update_data["managerId"] = manager_id
    
    # Perform the update
    result = store_collection.update_one({"_id": object_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Store not found")
    
    # Get the updated store
    updated_store = store_collection.find_one({"_id": object_id})
    updated_store["id"] = str(updated_store["_id"])
    # Remove the _id field to avoid conflicts with the response model
    updated_store.pop("_id", None)
    
    # Ensure managerId field exists (for backward compatibility)
    if "managerId" not in updated_store:
        import re
        manager_name = updated_store.get("manager", "unknown")
        updated_store["managerId"] = f"mgr-{re.sub(r'[^a-zA-Z0-9]', '', manager_name.lower())[:8]}-{str(hash(manager_name))[-4:]}"
    
    return updated_store

@router.delete("/{store_id}")
def delete_store(store_id: str):
    try:
        object_id = ObjectId(store_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid store ID format")
    
    result = store_collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Store not found")
    return {"message": "Store deleted"} 