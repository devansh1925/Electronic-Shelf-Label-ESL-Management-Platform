from fastapi import APIRouter, HTTPException
from models.sync_log import sync_log_collection
from schemas.sync_log import SyncLog, SyncLogCreate, SyncLogUpdate
from bson import ObjectId

router = APIRouter(prefix="/sync-logs", tags=["SyncLogs"])

@router.get("/", response_model=list[SyncLog])
def get_sync_logs():
    logs = list(sync_log_collection.find())
    for l in logs:
        l["id"] = str(l["_id"])
    return logs

@router.get("/{log_id}", response_model=SyncLog)
def get_sync_log(log_id: str):
    log = sync_log_collection.find_one({"_id": ObjectId(log_id)})
    if not log:
        raise HTTPException(status_code=404, detail="Sync log not found")
    log["id"] = str(log["_id"])
    return log

@router.post("/", response_model=SyncLog)
def create_sync_log(log: SyncLogCreate):
    result = sync_log_collection.insert_one(log.dict())
    new_log = sync_log_collection.find_one({"_id": result.inserted_id})
    new_log["id"] = str(new_log["_id"])
    return new_log

@router.put("/{log_id}", response_model=SyncLog)
def update_sync_log(log_id: str, log: SyncLogUpdate):
    result = sync_log_collection.update_one({"_id": ObjectId(log_id)}, {"$set": log.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Sync log not found")
    updated_log = sync_log_collection.find_one({"_id": ObjectId(log_id)})
    updated_log["id"] = str(updated_log["_id"])
    return updated_log

@router.delete("/{log_id}")
def delete_sync_log(log_id: str):
    result = sync_log_collection.delete_one({"_id": ObjectId(log_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sync log not found")
    return {"message": "Sync log deleted"} 